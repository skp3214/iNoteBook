const Notes = require('../models/Notes');

exports.findNotesByUser = async (userId) => {
    return await Notes.find({ user: userId }).populate('user');
};

exports.createNote = async (noteData) => {
    const note = new Notes(noteData);
    return await note.save();
};

exports.findNoteById = async (noteId) => {
    return await Notes.findById(noteId);
};

exports.updateNote = async (noteId, noteData) => {
    return await Notes.findByIdAndUpdate(noteId, { $set: noteData }, { new: true });
};

exports.deleteNote = async (noteId) => {
    return await Notes.findByIdAndDelete(noteId);
};
