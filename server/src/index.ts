import express from 'express';
import cors from 'cors';
import path from 'path';
import db from './db';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoints
app.get('/api/flashcards', (req, res) => {
  const cards = db.prepare('SELECT * FROM flashcards').all();
  res.json(cards);
});

app.post('/api/flashcards', (req, res) => {
  const { character, pinyin, english } = req.body;
  const result = db.prepare(
    'INSERT INTO flashcards (character, pinyin, english) VALUES (?, ?, ?)'
  ).run(character, pinyin, english);
  const created = db.prepare('SELECT * FROM flashcards WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

app.put('/api/flashcards/:id', (req, res) => {
  const { id } = req.params;
  const { character, pinyin, english } = req.body;
  const result = db.prepare(
    'UPDATE flashcards SET character = ?, pinyin = ?, english = ? WHERE id = ?'
  ).run(character, pinyin, english, id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Not found' });
  }
  const updated = db.prepare('SELECT * FROM flashcards WHERE id = ?').get(id);
  res.json(updated);
});

app.delete('/api/flashcards/:id', (req, res) => {
  const { id } = req.params;
  const result = db.prepare('DELETE FROM flashcards WHERE id = ?').run(id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json({ success: true });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
