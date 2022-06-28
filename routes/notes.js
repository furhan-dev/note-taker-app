const notes = require('express').Router();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const {
    readFromFile,
    readAndAppend,
    writeToFile,
} = require('../helpers/fsUtils');

notes.get('/', async (req, res) => {
    console.log(path.join(__dirname, '../db/db.json'));
    const data = await readFromFile(path.join(__dirname, '../db/db.json'));
    res.json(JSON.parse(data));
});

module.exports = notes;