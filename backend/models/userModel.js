const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const bcrypt = require('bcrypt');
const path = require('path');

const adapter = new FileSync(path.join(__dirname, '../db/users.db.json'));
const db = low(adapter);

db.defaults({ users: [] }).write();

const getUserByEmail = (email) => db.get('users').find({ email }).value();
const getUserByPhone = (phone) => db.get('users').find({ phone }).value();
const getUserByUsername = (username) => db.get('users').find({ username }).value();
const addUser = (user) => db.get('users').push(user).write();
const updateUserPassword = (identifier, password) => {
  const user = db.get('users').find(identifier);
  if (user.value()) {
    user.assign({ password }).write();
    return true;
  }
  return false;
};

module.exports = {
  getUserByEmail,
  getUserByPhone,
  getUserByUsername,
  addUser,
  updateUserPassword,
  db
};