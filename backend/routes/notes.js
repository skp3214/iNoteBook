const express = require('express');
const { body } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const notesController = require('../controller/notes.controller')
const router = express.Router();

router.get('/fetchallnotes', fetchuser, notesController.fetchAllNotes);

router.post('/addnotes', fetchuser, [
    body("title", "Title is required").not().isEmpty(),
    body("description").isLength({ min: 5 }).withMessage("Description must be at least 5 chars long"),
], notesController.addNote);

router.put('/updatenotes/:id', fetchuser, [
    body("title", "Title is required").not().isEmpty(),
    body("description").isLength({ min: 5 }).withMessage("Description must be at least 5 chars long"),
], notesController.updateNote);

router.delete('/deletenotes/:id', fetchuser, notesController.deleteNote);

module.exports = router;
