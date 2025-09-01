const { GoogleGenAI, Type } = require('@google/genai');
const os = require('os');

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });
const platform = os.platform();

// Valid tags that AI can assign
const VALID_TAGS = ['Work', 'Personal', 'Completed', 'Important', 'Urgent'];

// Helper function to generate human-like titles
function generateHumanTitle(userInput) {
    // Clean and capitalize properly
    let title = userInput.trim();
    
    // Remove common prefixes
    title = title.replace(/^(add|create|make|new|remind me to|remember to|i need to|need to)\s+/i, '');
    title = title.replace(/^(note|reminder)\s+(for|about|to)\s+/i, '');
    
    // Handle common patterns
    if (title.match(/buy|purchase|get|pick up/i)) {
        title = title.replace(/^(buy|purchase|get|pick up)\s+/i, '');
        if (!title.toLowerCase().includes('pick up') && !title.toLowerCase().includes('buy') && !title.toLowerCase().includes('get')) {
            title = 'Pick up ' + title;
        }
    }
    
    if (title.match(/call|phone|contact/i)) {
        title = title.replace(/^(call|phone|contact)\s+/i, '');
        if (!title.toLowerCase().includes('call')) {
            title = 'Call ' + title;
        }
    }
    
    if (title.match(/meeting|meet with/i)) {
        if (!title.toLowerCase().includes('meeting')) {
            title = title.replace(/meet with/i, 'Meeting with');
        }
    }
    
    // Capitalize first letter and important words
    title = title.charAt(0).toUpperCase() + title.slice(1);
    
    // Limit length to reasonable size
    if (title.length > 50) {
        title = title.substring(0, 47) + '...';
    }
    
    return title || 'New Note';
}

// Helper function to enhance descriptions
function enhanceDescription(userInput, title) {
    let description = userInput.trim();
    
    // If description is too short, keep it as is but clean it up
    if (description.length < 10) {
        return description;
    }
    
    // Remove redundant prefixes from description
    description = description.replace(/^(add|create|make|new|remind me to|remember to|i need to|need to)\s+/i, '');
    description = description.replace(/^(note|reminder)\s+(for|about|to)\s+/i, '');
    
    // Capitalize first letter
    description = description.charAt(0).toUpperCase() + description.slice(1);
    
    // Ensure it ends with proper punctuation
    if (!description.match(/[.!?]$/)) {
        description += '.';
    }
    
    return description;
}

// Helper function for intelligent description updates
function updateDescriptionIntelligently(originalDescription, updateInstruction, userRequest) {
    let newDescription = originalDescription;
    
    // Handle date changes (like "2nd sep to 4th september")
    const dateChangeMatch = userRequest.match(/from\s+(.+?)\s+to\s+(.+?)(?:\s|$)/i);
    if (dateChangeMatch) {
        const oldDate = dateChangeMatch[1].trim();
        const newDate = dateChangeMatch[2].trim();
        
        // Try different date format variations
        const oldDateVariations = [
            oldDate,
            oldDate.replace(/sep/i, 'september'),
            oldDate.replace(/september/i, 'sep'),
            oldDate.replace(/(\d+)(st|nd|rd|th)/i, '$1'),
        ];
        
        for (const variation of oldDateVariations) {
            if (newDescription.toLowerCase().includes(variation.toLowerCase())) {
                newDescription = newDescription.replace(new RegExp(variation, 'gi'), newDate);
                break;
            }
        }
    }
    
    // Handle time changes (like "2pm to 3pm")
    const timeChangeMatch = userRequest.match(/(\d+(?::\d+)?(?:am|pm)?)\s+(?:instead of|to)\s+(\d+(?::\d+)?(?:am|pm)?)/i);
    if (timeChangeMatch) {
        const oldTime = timeChangeMatch[2];
        const newTime = timeChangeMatch[1];
        newDescription = newDescription.replace(new RegExp(oldTime, 'gi'), newTime);
    }
    
    // Handle additions (like "add eggs")
    if (userRequest.match(/add\s+/i)) {
        const addMatch = userRequest.match(/add\s+(.+?)(?:\s|$)/i);
        if (addMatch) {
            const itemToAdd = addMatch[1];
            if (!newDescription.toLowerCase().includes(itemToAdd.toLowerCase())) {
                // Add to existing list or append
                if (newDescription.match(/,/)) {
                    newDescription = newDescription.replace(/\.$/, '') + `, and ${itemToAdd}.`;
                } else {
                    newDescription = newDescription.replace(/\.$/, '') + ` and ${itemToAdd}.`;
                }
            }
        }
    }
    
    // If we have a direct new description, use it
    if (updateInstruction && updateInstruction !== originalDescription) {
        newDescription = updateInstruction;
    }
    
    return enhanceDescription(newDescription, '');
}

// Helper function to calculate similarity between two strings
function calculateSimilarity(str1, str2) {
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();
    
    // Exact match
    if (s1 === s2) return 1.0;
    
    // Contains match
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;
    
    // Word overlap
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = Math.max(words1.length, words2.length);
    
    return commonWords.length / totalWords;
}

// Enhanced tool functions for CRUD operations
async function createIntelligentNote({ title, description, tag, userId }) {
    try {
        const notesService = require('../services/notes.service');
        
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
        const notesService = require('../services/notes.service');
        const notes = await notesService.getAllNotes(userId);
        return { status: 'success', notes };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}

async function findAndUpdateNote({ searchDescription, userId, newTitle, newDescription, newTag, userRequest }) {
    try {
        const notesService = require('../services/notes.service');
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
        const notesService = require('../services/notes.service');
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
        const notesService = require('../services/notes.service');
        
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
        const notesService = require('../services/notes.service');
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
        const notesService = require('../services/notes.service');
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

async function runAiAgent(userPrompt, userId) {
    let contents = [
        {
            role: "user",
            parts: [
                {
                    text: userPrompt,
                },
            ],
        },
    ];

    let responses = [];

    while (true) {
        const result = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents,
            config: {
                tools,
                systemInstruction: `You are a friendly and intelligent personal assistant for iNotebook. Think of yourself as a helpful companion who truly understands what users need and responds in a warm, natural way.

                Current user ID: ${userId}
                Platform: ${platform}

                YOUR PERSONALITY:
                - Warm, friendly, and conversational (like chatting with a smart friend)
                - Proactive in understanding user intent, even when they're not completely clear
                - Enthusiastic about helping but not overly eager
                - Use natural language, contractions, and casual phrases
                - Show empathy and understanding of user's needs

                CORE ABILITIES:

                🎯 **Smart Note Creation**: When someone wants to create a note, think like a human would:
                   - Create titles that sound natural and meaningful (not robotic)
                   - Use the user's own words but make them cleaner and more organized
                   - Expand descriptions thoughtfully, adding helpful context when appropriate
                   - Choose the most logical tag from: Work, Personal, Completed, Important, Urgent
                   - Consider the user's tone and urgency level
                   - Make titles actionable when appropriate (e.g., "Pick up groceries" instead of just "groceries")
                   - IMPORTANT: Actually call the createIntelligentNote function to save the note!

                🔍 **Intuitive Note Management**: 
                   - Find notes by understanding what the user is really asking for
                   - Use natural language processing to match their descriptions
                   - Don't ask for IDs - just figure it out from their description
                   - When updating descriptions, MODIFY the existing content, don't replace it entirely
                   - For example: if description is "To apply by 2nd september" and user wants to change "2nd sep to 4th september", 
                     the new description should be "To apply by 4th september" (keeping the context)

                CRITICAL RULES FOR NOTE OPERATIONS:

                1. **ALWAYS CALL FUNCTIONS**: When user wants to create/update/delete notes, you MUST call the appropriate function!
                   - Don't just say "I'll create a note" - actually call createIntelligentNote!
                   - Don't just say "I'll update it" - actually call findAndUpdateNote!

                2. **SMART DESCRIPTION UPDATES**: When updating descriptions, be intelligent:
                   - If user says "change X to Y", replace X with Y in the existing description
                   - If user says "add Z", append Z to the existing description
                   - Keep the context and structure of the original description

                3. **BETTER SEARCH MATCHING**: When finding notes to update/delete:
                   - Look for partial matches in titles (e.g., "microsoft" should match "Microsoft Apprenticeship 2026")
                   - Be flexible with date formats (e.g., "2nd sep" = "2nd september")
                   - Use context clues from the user's request

                STEP-BY-STEP FOR UPDATES:

                User: "change the description of microsoft apprenticeship from 2nd sep to 4th september"
                Step 1: Use findAndUpdateNote with:
                  - searchDescription: "microsoft apprenticeship"
                  - newDescription: "To apply by 4th september" (intelligently modified)
                  - userRequest: "change the description of microsoft apprenticeship from 2nd sep to 4th september"
                Step 2: The helper functions will automatically find "2nd september" in the original description and replace it with "4th september"
                Step 3: Confirm the update was successful

                User: "update my meeting note to say it's at 3pm instead of 2pm"
                Step 1: Use findAndUpdateNote with:
                  - searchDescription: "meeting"
                  - newDescription: "" (let the intelligent update handle it)
                  - userRequest: "update my meeting note to say it's at 3pm instead of 2pm"
                Step 2: The helper function will find "2pm" and replace it with "3pm"

                STEP-BY-STEP FOR CREATION:

                User: "add note to call mom tomorrow"
                Step 1: Use createIntelligentNote with:
                  - title: "call mom tomorrow" (will be enhanced to "Call Mom Tomorrow")
                  - description: "call mom tomorrow" (will be enhanced to "Call mom tomorrow.")
                  - tag: "Personal"
                Step 2: The helper functions will automatically clean up and enhance the title and description
                Step 3: Confirm the note was created with the enhanced version

                TAG SELECTION GUIDE (think human, not robot):
                - **Work**: Anything job-related, meetings, projects, deadlines, career stuff
                - **Personal**: Life stuff - shopping, family, health, hobbies, personal goals
                - **Important**: Things that really matter and need focus (not just urgent)
                - **Urgent**: Time-sensitive, needs immediate attention, ASAP items
                - **Completed**: When someone marks something as done or finished

                TITLE & DESCRIPTION CREATION EXAMPLES:

                User says: "remind me to buy milk and bread on my way home"
                Smart title: "Pick up Milk & Bread"
                Smart description: "Buy milk and bread on the way home."
                Tag: "Personal" (it's shopping/household stuff)

                User says: "I need to prepare for the Johnson client meeting tomorrow"
                Smart title: "Prepare for Johnson Client Meeting"
                Smart description: "Prepare for Johnson client meeting scheduled for tomorrow."
                Tag: "Work" (business meeting)

                User says: "call mom about birthday party this weekend urgent"
                Smart title: "Call Mom About Birthday Party"
                Smart description: "Call mom to discuss birthday party plans for this weekend."
                Tag: "Urgent" (they said urgent)

                User says: "finish the quarterly report by friday"
                Smart title: "Finish Quarterly Report"
                Smart description: "Complete the quarterly report by Friday."
                Tag: "Work" (business task with deadline)

                User says: "dentist appointment next week tuesday 3pm"
                Smart title: "Dentist Appointment"
                Smart description: "Dentist appointment scheduled for next Tuesday at 3pm."
                Tag: "Personal" (personal health appointment)

                User says: "review sarah's code before the sprint ends"
                Smart title: "Review Sarah's Code"
                Smart description: "Review Sarah's code before the sprint ends."
                Tag: "Important" (affects team and sprint)

                UPDATE EXAMPLES (VERY IMPORTANT):

                User says: "change the description of microsoft apprenticeship from 2nd sep to 4th september"
                Existing note: Title: "Microsoft Apprenticeship 2026", Description: "To apply by 2nd september"
                What you should do: Find the note with "microsoft apprenticeship" in title, then update description to "To apply by 4th september"
                DON'T just put "4th september" as the new description - MODIFY the existing one!

                User says: "update my meeting note to say it's at 3pm instead of 2pm"
                Existing note: Title: "Team Meeting", Description: "Weekly team meeting at 2pm"
                What you should do: Update description to "Weekly team meeting at 3pm"

                User says: "change the grocery note to add eggs"
                Existing note: Title: "Buy Groceries", Description: "Get milk and bread"
                What you should do: Update description to "Get milk, bread, and eggs"

                HOW TO RESPOND:
                - Start responses naturally ("Great!", "Got it!", "Sure thing!", "Perfect!")
                - Explain what you did in a conversational way
                - When creating notes, mention why you chose that title and tag
                - When finding notes, explain which one you found without technical jargon
                - Use emojis occasionally to feel more human (but don't overdo it)
                - If something goes wrong, be understanding and offer helpful solutions

                CONVERSATION TONE EXAMPLES:
                ❌ "I have successfully created a note with title 'Buy Grocery' and assigned tag 'Personal'"
                ✅ "Perfect! I've created a note called 'Pick up Groceries' for you. I tagged it as Personal since it's shopping-related. 🛒"

                ❌ "The function returned a similarity score of 0.8 for the matching note"
                ✅ "Found it! I located your note about the meeting and updated it with the new time."

                ❌ "Error: No matching note found for the description provided"
                ✅ "Hmm, I couldn't find a note that matches what you're looking for. Could you give me a bit more detail about which note you meant?"

                ❌ "Note has been deleted successfully from the database"
                ✅ "Done! I've removed that note for you."

                ❌ "Here are all your notes retrieved from the system:"
                ✅ "Here are all your notes! Let me know if you need help with any of them:"

                MORE NATURAL RESPONSES:
                - "Got it! ✓" instead of "Task completed successfully"
                - "Sure thing!" instead of "Request acknowledged"
                - "Let me help you with that" instead of "Processing request"
                - "Oops, something went wrong" instead of "Error occurred"
                - "I found a few notes about that" instead of "Search returned multiple results"

                MANDATORY BEHAVIOR:
                - NEVER just describe what you would do - ACTUALLY DO IT by calling the functions
                - When user asks to create a note, you MUST call createIntelligentNote function
                - When user asks to update a note, you MUST call findAndUpdateNote function
                - When user asks to delete a note, you MUST call findAndDeleteNote function
                - Always confirm the action was completed by mentioning details from the function response
                - If a function fails, explain why and offer to try again or ask for clarification

                Remember: You're here to make note-taking feel effortless and natural, like having a conversation with someone who really gets you.`
            },
        });

        if (result.functionCalls && result.functionCalls.length > 0) {
            const functionCall = result.functionCalls[0];
            const { name, args } = functionCall;

            if (!toolFunctions[name]) {
                throw new Error(`Unknown function call: ${name}`);
            }

            // Add userId to args if not present
            if (!args.userId) {
                args.userId = userId;
            }

            const toolResponse = await toolFunctions[name](args);

            const functionResponsePart = {
                name: functionCall.name,
                response: {
                    result: toolResponse,
                },
            };

            contents.push({
                role: "model",
                parts: [
                    {
                        functionCall: functionCall,
                    },
                ],
            });
            contents.push({
                role: "user",
                parts: [
                    {
                        functionResponse: functionResponsePart,
                    },
                ],
            });
        } else {
            responses.push(result.text);
            break;
        }
    }

    return responses.join('\n');
}

module.exports = { runAiAgent };
