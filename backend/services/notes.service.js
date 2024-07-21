const notesDao = require('../dao/notes.dao');

exports.getAllNotes = async (userId) => {
    return await notesDao.findNotesByUser(userId);
};

exports.createNote = async (noteData) => {
    return await notesDao.createNote(noteData);
};

exports.updateNote = async (noteId, userId, noteData) => {
    let note = await notesDao.findNoteById(noteId);
    if (!note) {
        return null;
    }
    if (note.user.toString() !== userId) {
        return null;
    }
    return await notesDao.updateNote(noteId, noteData);
};

exports.deleteNote = async (noteId, userId) => {
    let note = await notesDao.findNoteById(noteId);
    if (!note) {
        return null;
    }
    if (note.user.toString() !== userId) {
        return null;
    }
    return await notesDao.deleteNote(noteId);
};
