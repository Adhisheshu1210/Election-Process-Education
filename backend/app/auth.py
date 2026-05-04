from pathlib import Path

from fastapi import HTTPException, status, Depends
from jose import JWTError, jwt
from datetime import datetime, timedelta
import re

from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import sessionmaker, declarative_base

from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer

# ================= SECURITY =================
# bcrypt alone truncates at 72 bytes; bcrypt_sha256 keeps the bcrypt backend
# but safely handles longer passwords before hashing.
pwd_context = CryptContext(schemes=["bcrypt_sha256", "bcrypt"], deprecated="auto")

SECRET_KEY = "supersecretkey123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str):
    try:
        return pwd_context.verify(plain, hashed)
    except Exception:
        return False


# ================= DATABASE =================
BASE_DIR = Path(__file__).resolve().parent.parent
SQLALCHEMY_DATABASE_URL = f"sqlite:///{(BASE_DIR / 'users.db').as_posix()}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


# ================= USER MODEL =================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    phone = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    gender = Column(String)
    quiz_practice_score = Column(Integer, default=0)
    quiz_exam_score = Column(Integer, default=0)
    total_quizzes = Column(Integer, default=0)


Base.metadata.create_all(bind=engine)


# ================= VALIDATION =================
def normalize_email(email: str) -> str:
    return email.strip().lower()


def validate_email(email: str):
    if not email or not email.strip():
        raise HTTPException(status_code=400, detail="Email is required")

    normalized_email = normalize_email(email)

    if not normalized_email.endswith("@gmail.com"):
        raise HTTPException(status_code=400, detail="Email must end with @gmail.com")

    return normalized_email


def validate_phone(phone: str):
    if not phone or not phone.strip():
        raise HTTPException(status_code=400, detail="Phone is required")

    cleaned_phone = phone.strip()

    if not re.fullmatch(r"\d{10}", cleaned_phone):
        raise HTTPException(status_code=400, detail="Phone must be exactly 10 digits and numeric only")

    return cleaned_phone


def validate_password(password: str):
    if not password:
        raise HTTPException(status_code=400, detail="Password is required")

    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    if not re.search(r"[A-Z]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least 1 uppercase letter")

    if not re.search(r"[a-z]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least 1 lowercase letter")

    if not re.search(r"[0-9]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least 1 number")


def validate_required_field(value: str, field_name: str) -> str:
    if not value or not value.strip():
        raise HTTPException(status_code=400, detail=f"{field_name} is required")
    return value.strip()


# ================= REGISTER =================
def register_user(username, phone, email, password, gender):
    username = validate_required_field(username, "Username")
    gender = validate_required_field(gender, "Gender")
    phone = validate_phone(phone)
    email = validate_email(email)
    validate_password(password)

    db = SessionLocal()
    try:
        existing_email = db.query(User).filter(User.email == email).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already registered")

        existing_phone = db.query(User).filter(User.phone == phone).first()
        if existing_phone:
            raise HTTPException(status_code=400, detail="Phone already registered")

        user = User(
            username=username,
            phone=phone,
            email=email,
            password=hash_password(password),
            gender=gender
        )

        db.add(user)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail="Email or phone already registered")
        db.refresh(user)

        return {
            "id": user.id,
            "username": user.username,
            "phone": user.phone,
            "email": user.email,
            "gender": user.gender,
        }

    finally:
        db.close()


# ================= LOGIN =================
def authenticate_user(email=None, phone=None, password=None):
    db = SessionLocal()
    try:
        user = None

        if email:
            user = db.query(User).filter(User.email == normalize_email(email)).first()
        elif phone:
            user = db.query(User).filter(User.phone == phone.strip()).first()

        if not user:
            return None

        if not verify_password(password, user.password):
            return None

        return user

    finally:
        db.close()


# ================= JWT TOKEN =================
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ================= CURRENT USER =================
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")

        if username is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise credentials_exception
        return user
    finally:
        db.close()


# ================= RESET PASSWORD =================
def reset_password(identifier: str, new_password: str):
    validate_password(new_password)

    if not identifier or not identifier.strip():
        raise HTTPException(status_code=400, detail="Email or phone is required")

    cleaned_identifier = identifier.strip()
    normalized_identifier = normalize_email(cleaned_identifier) if "@" in cleaned_identifier else cleaned_identifier

    db = SessionLocal()
    try:
        user = db.query(User).filter(
            (User.email == normalized_identifier) | (User.phone == cleaned_identifier)
        ).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        user.password = hash_password(new_password)
        db.commit()

        return True

    finally:
        db.close()