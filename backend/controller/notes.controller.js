const { validationResult } = require('express-validator');
const notesService = require('../services/notes.service');

exports.fetchAllNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const notes = await notesService.getAllNotes(userId);
        res.json(notes);
    } catch (err) {
        console.log(err);
        res.status(401).send("Server Error");
    }
};

exports.addNote = async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: 'Validation failed',
                data: errors.array()
            });
        }
        const note = await notesService.createNote({
            title,
            description,
            tag,
            user: req.user.id
        });
        res.json(note);
    } catch (err) {
        console.log(err);
        res.status(409).send('Conflict');
    }
};

exports.updateNote = async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const noteId = req.params.id;
        const userId = req.user.id;
        const note = await notesService.updateNote(noteId, userId, { title, description, tag });
        if (!note) {
            return res.status(400).json({ error: "The note with the given ID was not found." });
        }
        res.json(note);
    } catch (err) {
        console.log(err);
        res.status(401).send("Server Error");
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.user.id;
        const result = await notesService.deleteNote(noteId, userId);
        if (!result) {
            return res.status(400).json({ error: "The note with the given ID was not found." });
        }
        res.json({ "Success": "Note has been deleted", note: result });
    } catch (err) {
        console.log(err);
        res.status(401).send("Server Error");
    }
};
