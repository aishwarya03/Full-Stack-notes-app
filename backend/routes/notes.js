const express = require('express');
const router = express.Router();
const knex = require('../db'); // your knex config
const authenticateToken = require('../middleware/auth');

// GET all notes for logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const notes = await knex('notes').where({ user_id: req.user.id });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching notes' });
  }
});

// POST a new note
router.post('/', authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  try {
    const [newNote] = await knex('notes')
      .insert({ title, content, user_id: req.user.id })
      .returning('*');
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: 'Error creating note' });
  }
});

// PUT update note
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updated = await knex('notes')
      .where({ id, user_id: req.user.id })
      .update({ title, content })
      .returning('*');

    if (updated.length === 0) return res.status(404).json({ error: 'Note not found' });

    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error updating note' });
  }
});

// DELETE note
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await knex('notes')
      .where({ id, user_id: req.user.id })
      .del()
      .returning('*');

    if (deleted.length === 0) return res.status(404).json({ error: 'Note not found' });

    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting note' });
  }
});

module.exports = router;
