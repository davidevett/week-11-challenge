const express = require('express');
const path = require('path');
const fs = require('fs');


const PORT = 3001;

const app = express();

const deleteNote = (file) => {
  const notes = require('./db/db.json');
  const index = notes.findIndex((note) => note.id === parseInt(file));
  if (index !== -1) {
    notes.splice(index, 1);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));
  }
};
// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve up static assets from the public folder
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './db/db.json'));
});
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  const notes = require('./db/db.json');
  newNote.id = notes.length + 1;
  notes.push(newNote);
  fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  deleteNote('./db/db.json', req.params.id);
});

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);