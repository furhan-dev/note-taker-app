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

notes.post('/', (req, res) => {
    console.info(`${req.method} request received to add note`);

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
        res.json('Error in saving note');
    }
});

module.exports = notes;