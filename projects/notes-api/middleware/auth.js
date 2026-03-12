const jwt = require('jsonwebtoken');
const db = require('../models/db');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

const requireRole = (role) => (req, res, next) => {
  db.get('SELECT role FROM users WHERE id = ?', [req.user.id], (err, row) => {
    if (err || !row || row.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  });
};

module.exports = { authenticateToken, requireRole };
