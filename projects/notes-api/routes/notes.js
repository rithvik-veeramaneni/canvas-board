const express = require('express');
const Joi = require('joi');
const db = require('../models/db');
const { authenticateToken, requireRole } = require('../middleware/auth');
const router = express.Router();

const noteSchema = Joi.object({ title: Joi.string().min(1).required(), content: Joi.string().required() });

router.use(authenticateToken);

// User own notes
router.get('/', (req, res) => {
  db.all('SELECT * FROM notes WHERE userId = ? ORDER BY created_at DESC', [req.user.id], (err, notes) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(notes);
  });
});

router.post('/', (req, res) => {
  const { error } = noteSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const { title, content } = req.body;
  db.run('INSERT INTO notes (title, content, userId) VALUES (?, ?, ?)', [title, content, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.status(201).json({ id: this.lastID });
  });
});

router.put('/:id', (req, res) => {
  const { error } = noteSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const { title, content } = req.body;
  db.run('UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?', [title, content, req.params.id, req.user.id], function(err) {
    if (err || this.changes === 0) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Updated' });
  });
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM notes WHERE id = ? AND userId = ?', [req.params.id, req.user.id], function(err) {
    if (err || this.changes === 0) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Deleted' });
  });
});

// Admin: all notes + delete any
router.get('/all', requireRole('admin'), (req, res) => {
  db.all('SELECT n.*, u.username FROM notes n JOIN users u ON n.userId = u.id ORDER BY n.created_at DESC', (err, notes) => {
    res.json(notes);
  });
});

router.delete('/admin/:id', requireRole('admin'), (req, res) => {
  db.run('DELETE FROM notes WHERE id = ?', [req.params.id], function(err) {
    if (this.changes === 0) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Deleted' });
  });
});

module.exports = router;
