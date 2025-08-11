const Notes = require('../models/Notes');

exports.findNotesByUser = async (userId) => {
    const notes = await Notes.find({ user: userId }).populate('user');
    // Optional: Log only when there's useful debug info
    if (process.env.NODE_ENV === 'development' && notes.length === 0) {
        console.log(`No notes found for user: ${userId}`);
    }
    return notes;
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
