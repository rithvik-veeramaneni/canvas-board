const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const db = require('../models/db');
const router = express.Router();

const registerSchema = Joi.object({ username: Joi.string().min(3).required(), email: Joi.string().email().required(), password: Joi.string().min(6).required() });

router.post('/register', async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { username, email, password, role = 'user' } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  db.run('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [username, email, hashed, role], function(err) {
    if (err) return res.status(400).json({ error: 'User exists' });
    const token = jwt.sign({ id: this.lastID }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, role });
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, role: user.role });
  });
});

module.exports = router;
