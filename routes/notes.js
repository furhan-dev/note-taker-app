const notes = require('express').Router();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const {
    readFromFile,
    readAndAppend,
    writeToFile,
} = require('../helpers/fsUtils');

notes.get('/', async (req, res) => {
    const data = await readFromFile(path.join(__dirname, '../db/db.json'));
    res.json(JSON.parse(data));
});

notes.get('/:id', async (req, res) => {
    const requestedNote = req.params.id.toLowerCase();

    // read all notes from db
    const data = await readFromFile(path.join(__dirname, '../db/db.json'));
    const allNotes = JSON.parse(data);

    // filter notes on id
    const matchingNote = allNotes.filter(note => note.id === requestedNote);
    if (matchingNote) {
        return res.status(200).json(matchingNote);
    } else {
        res.status(404).json("Note not found!");
    }
});

notes.post('/', (req, res) => {
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        readAndAppend(newNote, path.join(__dirname, '../db/db.json'));

        const response = {
            status: 'success',
            body: newNote,
        };

        res.json(response);
    } else {
        res.status(500).json('Error in saving note');
    }
});

notes.delete('/:id', async (req, res) => {
    const noteToDelete = req.params.id.toLowerCase();

    // read all notes from db
    const data = await readFromFile(path.join(__dirname, '../db/db.json'));
    const allNotes = JSON.parse(data);

    // filter notes on id
    const filteredNotes = allNotes.filter(note => note.id !== noteToDelete);
    if (filteredNotes.length === allNotes.length - 1) {
        writeToFile(path.join(__dirname, '../db/db.json'), filteredNotes);
        return res.status(200).json(filteredNotes);
    } else {
        res.status(404).json("Note not found!");
    }
});

module.exports = notes;