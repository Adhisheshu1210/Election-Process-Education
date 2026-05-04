const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  getUserByEmail,
  getUserByPhone,
  addUser,
  updateUserPassword,
  db
} = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

function validateEmail(email) {
  return /^([\w-\.]+)@gmail\.com$/.test(email);
}
function validatePhone(phone) {
  return /^\d{10}$/.test(phone);
}
function validatePassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

exports.register = async (req, res) => {
  const { username, phone, email, password } = req.body;
  if (!username || !phone || !email || !password)
    return res.status(400).json({ error: 'All fields are required' });
  if (!validatePhone(phone))
    return res.status(400).json({ error: 'Phone must be 10 digits' });
  if (!validateEmail(email))
    return res.status(400).json({ error: 'Email must be a valid Gmail address' });
  if (!validatePassword(password))
    return res.status(400).json({ error: 'Password must be at least 8 chars, 1 uppercase, 1 lowercase, 1 number' });
  if (getUserByEmail(email) || getUserByPhone(phone))
    return res.status(400).json({ error: 'User already exists' });
  const hashed = await bcrypt.hash(password, 10);
  addUser({ username, phone, email, password: hashed });
  return res.json({ message: 'Registration successful' });
};

exports.login = async (req, res) => {
  const { email, phone, password } = req.body;
  let user = null;
  if (email) user = getUserByEmail(email);
  else if (phone) user = getUserByPhone(phone);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ email: user.email, phone: user.phone }, JWT_SECRET, { expiresIn: '2h' });
  return res.json({ message: 'Login successful', token });
};

exports.forgot = async (req, res) => {
  const { email, phone, new_password } = req.body;
  let user = null;
  if (email) user = getUserByEmail(email);
  else if (phone) user = getUserByPhone(phone);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!validatePassword(new_password))
    return res.status(400).json({ error: 'Password must be at least 8 chars, 1 uppercase, 1 lowercase, 1 number' });
  const hashed = await bcrypt.hash(new_password, 10);
  updateUserPassword({ email: user.email }, hashed);
  return res.json({ message: 'Password reset successful' });
};
