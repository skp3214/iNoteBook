const { GoogleGenAI } = require('@google/genai');
const { getSystemInstruction } = require('../constants/constant');
const { toolFunctions } = require('./utils/toolFunction');
const { tools } = require('./utils/toolDeclarations');

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

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

async function runAiAgent(userPrompt, userId, sessionId = 'default') {
    const conversationKey = `${userId}_${sessionId}`;
    
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
    while (true) {
        const result = await ai.models.generateContent({
            model: "gemini-1.5-flash",
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
            responses.push(result.text);
            break;
        }
    }

    return responses.join('\n');
}

module.exports = { runAiAgent };