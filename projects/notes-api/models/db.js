const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('C:/Users/MY PC/OneDrive/Desktop/VSCode/projects/notes-api/notes.db');  // ← LINE 2

db.serialize(() => {
  // Drop existing tables if they exist
  db.run('DROP TABLE IF EXISTS notes');
  db.run('DROP TABLE IF EXISTS users');
  
  // Recreate tables
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user'
  )`);
  
  db.run(`CREATE TABLE notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    userId INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users (id)
  )`);
  
  console.log('Tables recreated!');
});

module.exports = db;


module.exports = db;
