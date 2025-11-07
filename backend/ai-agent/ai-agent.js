const { GoogleGenAI } = require('@google/genai');
const { getSystemInstruction } = require('../constants/constant');
const { toolFunctions } = require('./utils/toolFunction');
const { tools } = require('./utils/toolDeclarations');

// Default AI instance with company API key
const defaultAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

// Function to get AI instance based on API key
function getAIInstance(userApiKey) {
    if (userApiKey && userApiKey.trim()) {
        return new GoogleGenAI({ apiKey: userApiKey });
    }
    return defaultAI;
}

// In-memory conversation storage 
const conversationHistory = new Map();

setInterval(() => {
    const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
    for (const [userId, data] of conversationHistory.entries()) {
        if (data.lastUpdated < thirtyMinutesAgo) {
            conversationHistory.delete(userId);
        }
    }
}, 60 * 60 * 1000); // Check every 60 minutes

async function runAiAgent(userPrompt, userId, sessionId = 'default', userApiKey = null) {
    const conversationKey = `${userId}_${sessionId}`;
    
    // Get AI instance based on provided API key or use default
    const ai = getAIInstance(userApiKey);
    
    // Get or initialize conversation history
    let userConversation = conversationHistory.get(conversationKey);
    if (!userConversation) {
        userConversation = {
            contents: [],
            lastUpdated: Date.now()
        };
        conversationHistory.set(conversationKey, userConversation);
    }

    // Add current user message to conversation
    userConversation.contents.push({
        role: "user",
        parts: [
            {
                text: userPrompt,
            },
        ],
    });

    let contents = [...userConversation.contents];

    let responses = [];
    let sysInstruction = getSystemInstruction(userId, process.platform);
    
    // Enhanced system instruction with conversation context
    if (contents.length > 1) {
        sysInstruction += `\n\nCONVERSATION CONTEXT: You are continuing a conversation with this user. Look at the previous messages to understand the context and maintain continuity. If the user refers to "that note," "the note," "it," or similar references, they are likely referring to something mentioned earlier in this conversation. Always consider the conversation history when responding.`;
    }

    while (true) {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents,
            config: {
                tools,
                systemInstruction: sysInstruction,
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
            // Add the model's response to conversation history
            contents.push({
                role: "model",
                parts: [
                    {
                        text: result.text,
                    },
                ],
            });
            
            responses.push(result.text);
            break;
        }
    }

    // Update conversation history with all the new interactions
    userConversation.contents = contents;
    userConversation.lastUpdated = Date.now();
    conversationHistory.set(conversationKey, userConversation);

    return responses.join('\n');
}

module.exports = { runAiAgent };