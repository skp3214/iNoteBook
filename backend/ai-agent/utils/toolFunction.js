const { generateHumanTitle, enhanceDescription, updateDescriptionIntelligently, calculateSimilarity } = require('./helpers');

// Valid tags that AI can assign
const VALID_TAGS = ['Work', 'Personal', 'Completed', 'Important', 'Urgent'];

// Enhanced tool functions for CRUD operations
async function createIntelligentNote({ title, description, tag, userId }) {
    try {
        const notesService = require('../../services/notes.service');

        // Validate inputs
        if (!title || !description || !userId) {
            return { status: 'error', message: 'Missing required fields: title, description, or userId' };
        }

        // Use helper functions to improve title and description
        const enhancedTitle = generateHumanTitle(title);
        const enhancedDescription = enhanceDescription(description, enhancedTitle);

        // Validate tag
        if (!VALID_TAGS.includes(tag)) {
            tag = 'Personal'; // Default fallback
        }

        const noteData = {
            title: enhancedTitle,
            description: enhancedDescription,
            tag: tag,
            user: userId
        };

        const note = await notesService.createNote(noteData);

        if (!note) {
            return { status: 'error', message: 'Failed to create note in database' };
        }

        return {
            status: 'success',
            note,
            generatedTitle: enhancedTitle,
            originalTitle: title,
            generatedDescription: enhancedDescription,
            originalDescription: description,
            assignedTag: tag,
            message: `Note "${enhancedTitle}" created successfully with tag "${tag}"`
        };
    } catch (error) {
        return { status: 'error', message: `Failed to create note: ${error.message}` };
    }
}

async function fetchAllNotes({ userId }) {
    try {
        const notesService = require('../../services/notes.service');
        const notes = await notesService.getAllNotes(userId);
        return { status: 'success', notes };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}

async function findAndUpdateNote({ searchDescription, userId, newTitle, newDescription, newTag, userRequest }) {
    try {
        const notesService = require('../../services/notes.service');
        const notes = await notesService.getAllNotes(userId);

        // Find the most similar note
        let bestMatch = null;
        let bestScore = 0;

        for (const note of notes) {
            const titleScore = calculateSimilarity(note.title, searchDescription);
            const descScore = calculateSimilarity(note.description, searchDescription);
            const maxScore = Math.max(titleScore, descScore);

            if (maxScore > bestScore && maxScore > 0.3) { // Minimum similarity threshold
                bestScore = maxScore;
                bestMatch = note;
            }
        }

        if (!bestMatch) {
            return { status: 'error', message: "No matching note found for the description provided." };
        }

        // Update the found note with intelligent processing
        const updateData = {};

        if (newTitle) {
            updateData.title = generateHumanTitle(newTitle);
        }

        if (newDescription) {
            // Use intelligent description update if we have the original user request
            if (userRequest) {
                updateData.description = updateDescriptionIntelligently(
                    bestMatch.description,
                    newDescription,
                    userRequest
                );
            } else {
                updateData.description = enhanceDescription(newDescription, bestMatch.title);
            }
        }

        if (newTag && VALID_TAGS.includes(newTag)) {
            updateData.tag = newTag;
        }

        const updatedNote = await notesService.updateNote(bestMatch._id, userId, updateData);

        return {
            status: 'success',
            note: updatedNote,
            foundNote: bestMatch,
            similarity: bestScore,
            originalDescription: bestMatch.description,
            newDescription: updateData.description || bestMatch.description,
            updateApplied: updateData
        };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}

async function findAndDeleteNote({ searchDescription, userId }) {
    try {
        const notesService = require('../../services/notes.service');
        const notes = await notesService.getAllNotes(userId);

        // Find the most similar note
        let bestMatch = null;
        let bestScore = 0;

        for (const note of notes) {
            const titleScore = calculateSimilarity(note.title, searchDescription);
            const descScore = calculateSimilarity(note.description, searchDescription);
            const maxScore = Math.max(titleScore, descScore);

            if (maxScore > bestScore && maxScore > 0.3) { // Minimum similarity threshold
                bestScore = maxScore;
                bestMatch = note;
            }
        }

        if (!bestMatch) {
            return { status: 'error', message: "No matching note found for the description provided." };
        }

        // Delete the found note
        const result = await notesService.deleteNote(bestMatch._id, userId);

        if (!result) {
            return { status: 'error', message: "Failed to delete the note." };
        }

        return {
            status: 'success',
            message: "Note deleted successfully",
            deletedNote: bestMatch,
            similarity: bestScore
        };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}

async function updateNoteById({ noteId, userId, title, description, tag }) {
    try {
        const notesService = require('../../services/notes.service');

        // Validate tag
        if (tag && !VALID_TAGS.includes(tag)) {
            return { status: 'error', message: `Invalid tag. Must be one of: ${VALID_TAGS.join(', ')}` };
        }

        const note = await notesService.updateNote(noteId, userId, { title, description, tag });
        if (!note) {
            return { status: 'error', message: "Note not found or unauthorized" };
        }
        return { status: 'success', note };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}

async function deleteNoteById({ noteId, userId }) {
    try {
        const notesService = require('../../services/notes.service');
        const result = await notesService.deleteNote(noteId, userId);
        if (!result) {
            return { status: 'error', message: "Note not found or unauthorized" };
        }
        return { status: 'success', message: "Note deleted successfully" };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}

async function searchNotes({ userId, query }) {
    try {
        const notesService = require('../../services/notes.service');
        const notes = await notesService.getAllNotes(userId);

        // Enhanced search with similarity scoring
        const searchResults = notes.map(note => {
            const titleScore = calculateSimilarity(note.title, query);
            const descScore = calculateSimilarity(note.description, query);
            const tagScore = calculateSimilarity(note.tag, query);
            const maxScore = Math.max(titleScore, descScore, tagScore);

            return { note, score: maxScore };
        })
            .filter(result => result.score > 0.2) // Minimum relevance threshold
            .sort((a, b) => b.score - a.score) // Sort by relevance
            .map(result => result.note);

        return { status: 'success', notes: searchResults };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}

const toolFunctions = {
    createIntelligentNote,
    fetchAllNotes,
    findAndUpdateNote,
    findAndDeleteNote,
    updateNoteById,
    deleteNoteById,
    searchNotes
};

module.exports = { toolFunctions, VALID_TAGS };