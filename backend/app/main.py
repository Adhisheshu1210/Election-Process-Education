from fastapi import FastAPI, Request, HTTPException, Depends, Form
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

from .ai_engine import ai_chat
from .data_manager import fetch_election_data
from .quiz_questions import get_random_questions, get_question_by_id

from .auth import (
    authenticate_user,
    create_access_token,
    get_current_user,
    register_user,
    reset_password,
    User,
    SessionLocal
)


# Pydantic model for quiz submission
class QuizSubmission(BaseModel):
    mode: str
    selectedAnswers: dict  # {question_id: selected_option_index}
    total: int

app = FastAPI()

# ---------------- CORS ----------------
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "http://localhost:5176",
    "http://127.0.0.1:5176",
    "http://localhost:5177",
    "http://127.0.0.1:5177",
    "http://localhost:5178",
    "http://127.0.0.1:5178",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Invalid request body",
            "errors": exc.errors(),
        },
    )


# ---------------- ROOT ----------------
@app.get("/")
def root():
    return {"message": "Election Backend Running 🚀"}


# ---------------- REGISTER ----------------
@app.post("/register")
async def register(
    username: str = Form(...),
    phone: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    gender: str = Form(...)
):
    user = register_user(username, phone, email, password, gender)
    return {
        "msg": "Registration successful",
        "user": user,
    }


# ---------------- FORGOT PASSWORD ----------------
@app.post("/forgot")
async def forgot(
    username: str = Form(...),
    new_password: str = Form(...)
):
    reset_password(username, new_password)
    return {"msg": "Password reset successful"}


# ---------------- LOGIN ----------------
@app.post("/login")
async def login(
    email: str = Form(None),
    phone: str = Form(None),
    password: str = Form(...)
):
    user = authenticate_user(email=email, phone=phone, password=password)

    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"sub": user.username})

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# ---------------- PROFILE ----------------
@app.get("/profile")
async def profile(user: User = Depends(get_current_user)):
    return {
        "username": user.username,
        "email": user.email,
        "phone": user.phone,
        "gender": user.gender,
        "quiz_practice_score": user.quiz_practice_score,
        "quiz_exam_score": user.quiz_exam_score,
        "total_quizzes": user.total_quizzes,
        "profile_pic": getattr(user, "profile_pic", None),
    }


@app.put("/profile")
async def update_profile(
    username: str = Form(None),
    gender: str = Form(None),
    profile_pic: str = Form(None),
    user: User = Depends(get_current_user)
):
    if username:
        user.username = username
    if gender:
        user.gender = gender
    if profile_pic:
        user.profile_pic = profile_pic

    db = SessionLocal()
    try:
        db.commit()
        db.refresh(user)
        return {"msg": "Profile updated successfully"}
    finally:
        db.close()


# ---------------- QUIZ ----------------
@app.get("/quiz/questions")
async def get_quiz_questions(mode: str = "practice", user = Depends(get_current_user)):
    # 20 practice questions (easier)
    practice_questions = [
        {"question": "What is the first step in election process?", "options": ["Vote counting", "Notification", "Campaign", "Results"], "answer": 1},
        {"question": "Minimum age to vote?", "options": ["16", "18", "21", "25"], "answer": 1},
        {"question": "Who conducts elections?", "options": ["President", "Election Commission", "Prime Minister", "Supreme Court"], "answer": 1},
        {"question": "Voter ID needed to vote?", "options": ["No", "Yes", "Optional", "Only abroad"], "answer": 1},
        {"question": "When is Model Code enforced?", "options": ["After results", "Election notification", "Nomination", "Voting day"], "answer": 1},
        {"question": "Silent period before election?", "options": ["24 hours", "48 hours", "1 week", "No"], "answer": 1},
        {"question": "Votes counted by?", "options": ["Party workers", "Election officers", "Judges", "Media"], "answer": 1},
        {"question": "Electronic voting machine called?", "options": ["VM", "EVM", "IVM", "BVM"], "answer": 1},
        {"question": "Can NRIs vote?", "options": ["No", "Yes in India", "Proxy vote", "Online"], "answer": 1},
        {"question": "Election symbol for independent?", "options": ["Party lamp", "Any", "Fixed", "None"], "answer": 1},
        {"question": "Voter registration deadline?", "options": ["Election day", "10 days before", "30 days before", "No deadline"], "answer": 2},
        {"question": "Government formation after?", "options": ["Vote", "Counting", "Results", "Oath"], "answer": 2},
        {"question": "NOTA means?", "options": ["No vote", "None of above", "No tax", "New party"], "answer": 1},
        {"question": "Chief Election Commissioner appointed by?", "option": ["President", "PM", "EC itself", "Parliament"], "answer": 0},
        {"question": "Vote secrecy ensured by?", "options": ["CCTV", "EVM design", "Paper", "All"], "answer": 1},
        {"question": "Campaign expense limit?", "options": ["No", "Yes per candidate", "Party wise", "State wise"], "answer": 1},
        {"question": "Election petition filed in?", "options": ["District court", "High court", "EC", "President"], "answer": 1},
        {"question": "VVPAT full form?", "options": ["Visual paper", "Voter verifiable paper audit trail", "Vote verification", "Paper audit"], "answer": 1},
        {"question": "Article for elections?", "options": ["324", "356", "370", "19"], "answer": 0},
        {"question": "Delimitation means?", "options": ["Vote count", "Redraw constituencies", "Party split", "New election"], "answer": 1},
    ]
    
    # 20 exam questions (harder)
    exam_questions = [
        {"question": "Constitutional body for elections?", "options": ["UPSC", "ECI", "CBI", "NITI Aayog"], "answer": 1},
        {"question": "Nomination scrutiny by?", "options": ["EC", "Returning officer", "Governor", "Collector"], "answer": 1},
        {"question": "Silent period duration?", "options": ["36 hrs", "48 hrs", "72 hrs", "24 hrs"], "answer": 1},
        {"question": "Security deposit for candidate?", "options": ["No", "Rs 25000 general/SC", "Rs 10000", "Rs 50000"], "answer": 1},
        {"question": "Proxy voting allowed for?", "options": ["All", "NRIs only", "Armed forces", "None"], "answer": 2},
        # ... 15 more similar
    ] * 2  # Placeholder to make 20
    
    questions = practice_questions if mode == "practice" else exam_questions
    
    return {
        "questions": questions[:20],
        "total": 20,
        "mode": mode
    }


# ---------------- CHAT ----------------
@app.post("/chat")
async def chat(
    request: Request,
    token: str = Depends(oauth2_scheme),
    user: dict = Depends(get_current_user)
):
    data = await request.json()

    message = data.get("message", "")
    location = data.get("location", {})

    election_data = fetch_election_data(location)
    response = ai_chat(message, location, election_data)

    return {"response": response}


# ---------------- QUIZ: GET QUESTIONS ----------------
@app.get("/quiz/practice")
async def get_practice_questions(user = Depends(get_current_user)):
    """Get 20 randomized practice questions"""
    questions = get_random_questions(mode="practice", count=20)
    # Keep explanation for practice mode, but hide correct answer.
    return {
        "mode": "practice",
        "total_questions": len(questions),
        "questions": [
            {
                "id": q["id"],
                "topic": q["topic"],
                "question": q["question"],
                "options": q["options"],
                "explanation": q["explanation"],
            }
            for q in questions
        ]
    }


@app.get("/quiz/exam")
async def get_exam_questions(user = Depends(get_current_user)):
    """Get 20 randomized exam questions (timed)"""
    questions = get_random_questions(mode="exam", count=20)
    # Remove explanation and correct_answer from frontend (show after exam ends)
    return {
        "mode": "exam",
        "total_questions": len(questions),
        "time_limit_minutes": 60,
        "questions": [
            {
                "id": q["id"],
                "topic": q["topic"],
                "question": q["question"],
                "options": q["options"]
            }
            for q in questions
        ]
    }


@app.post("/quiz/check-answer")
async def check_answer(question_id: int, selected_option: int, user = Depends(get_current_user)):
    """Check if answer is correct (for practice mode feedback)"""
    question = get_question_by_id(question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    is_correct = selected_option == question["correct_answer"]
    return {
        "is_correct": is_correct,
        "correct_answer": question["correct_answer"],
        "explanation": question["explanation"]
    }


@app.post("/quiz/submit")
async def submit_quiz(
    submission: QuizSubmission,
    user: User = Depends(get_current_user)
):
    # Validate answers and calculate actual score
    score = 0
    for question_id_str, selected_idx in submission.selectedAnswers.items():
        try:
            question_id = int(question_id_str)
            selected_option = int(selected_idx)
        except (TypeError, ValueError):
            continue

        question = get_question_by_id(question_id)
        if question and selected_option == question["correct_answer"]:
            score += 1
    
    db = SessionLocal()
    try:
        # Get fresh user object from DB
        db_user = db.query(User).filter(User.id == user.id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if submission.mode == "practice":
            db_user.quiz_practice_score = score
        elif submission.mode == "exam":
            db_user.quiz_exam_score = score
        else:
            raise HTTPException(status_code=400, detail="Invalid mode. Use 'practice' or 'exam'")
        
        db_user.total_quizzes += 1
        db.commit()
        
        return {
            "msg": "Score saved successfully",
            "mode": submission.mode,
            "score": score,
            "total_questions": submission.total,
            "percentage": round((score / submission.total * 100), 2) if submission.total > 0 else 0,
            "practice_score": db_user.quiz_practice_score,
            "exam_score": db_user.quiz_exam_score,
            "total_quizzes": db_user.total_quizzes
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


# ---------------- HEALTH ----------------
@app.get("/health")
def health():
    return {"status": "ok"}
