const { Type } = require('@google/genai');

const tools = [
    {
        functionDeclarations: [
            {
                name: "createIntelligentNote",
                description: "Creates a thoughtful note with human-like title and description generation. Use this when the user wants to create, add, or save a note.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        title: {
                            type: Type.STRING,
                            description: "Create a natural, human-like title that captures the essence of what the user wants to remember. Make it concise but meaningful - think like how a person would actually title their note."
                        },
                        description: {
                            type: Type.STRING,
                            description: "A thoughtful description that expands on the user's request naturally. Add helpful context if appropriate, but keep it conversational and useful."
                        },
                        tag: {
                            type: Type.STRING,
                            description: "Choose the most appropriate tag based on the context and user's intent. Options: Work, Personal, Completed, Important, Urgent. Think about what category this would naturally fall into."
                        },
                        userId: {
                            type: Type.STRING,
                            description: "User ID who owns the note"
                        }
                    },
                    required: ["title", "description", "tag", "userId"],
                },
            },
            {
                name: "fetchAllNotes",
                description: "Gets all the user's notes so they can see what they have. Use when they ask to see, show, list, or view their notes.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        userId: { type: Type.STRING, description: "User ID to fetch notes for" }
                    },
                    required: ["userId"],
                },
            },
            {
                name: "findAndUpdateNote",
                description: "Finds a note by understanding what the user is talking about and updates it. Perfect when users describe a note rather than giving an ID.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        searchDescription: {
                            type: Type.STRING,
                            description: "What the user said about the note they want to update - could be part of the title, description, or general topic"
                        },
                        userId: {
                            type: Type.STRING,
                            description: "User ID who owns the note"
                        },
                        newTitle: {
                            type: Type.STRING,
                            description: "New title if they want to change it"
                        },
                        newDescription: {
                            type: Type.STRING,
                            description: "The complete new description. If user wants to modify part of existing description, intelligently update it. For example, if original is 'To apply by 2nd september' and user wants to change '2nd sep to 4th september', the new description should be 'To apply by 4th september'"
                        },
                        newTag: {
                            type: Type.STRING,
                            description: "New tag if they want to change it: Work, Personal, Completed, Important, Urgent"
                        },
                        userRequest: {
                            type: Type.STRING,
                            description: "The original user request for context to help with intelligent updates (e.g., 'change from 2nd sep to 4th september')"
                        }
                    },
                    required: ["searchDescription", "userId"],
                },
            },
            {
                name: "findAndDeleteNote",
                description: "Finds and removes a note based on the user's description. Use when they want to delete a note by describing it.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        searchDescription: {
                            type: Type.STRING,
                            description: "What the user said about the note they want to delete"
                        },
                        userId: {
                            type: Type.STRING,
                            description: "User ID who owns the note"
                        }
                    },
                    required: ["searchDescription", "userId"],
                },
            },
            {
                name: "updateNoteById",
                description: "Updates an existing note by its ID. Use this when user provides a specific note ID.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        noteId: { type: Type.STRING, description: "ID of the note to update" },
                        userId: { type: Type.STRING, description: "User ID who owns the note" },
                        title: { type: Type.STRING, description: "New title of the note" },
                        description: { type: Type.STRING, description: "New content/description of the note" },
                        tag: { type: Type.STRING, description: "New tag for the note. Must be one of: Work, Personal, Completed, Important, Urgent" }
                    },
                    required: ["noteId", "userId"],
                },
            },
            {
                name: "deleteNoteById",
                description: "Deletes a note by its ID. Use this when user provides a specific note ID.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        noteId: { type: Type.STRING, description: "ID of the note to delete" },
                        userId: { type: Type.STRING, description: "User ID who owns the note" }
                    },
                    required: ["noteId", "userId"],
                },
            },
            {
                name: "searchNotes",
                description: "Searches through notes intelligently to find what the user is looking for. Great for when they want to find notes about specific topics.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        userId: { type: Type.STRING, description: "User ID to search notes for" },
                        query: { type: Type.STRING, description: "What the user wants to search for in their notes" }
                    },
                    required: ["userId", "query"],
                },
            }
        ],
    },
];

module.exports = { tools };