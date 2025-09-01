const { GoogleGenAI } = require('@google/genai');
const { getSystemInstruction } = require('../constants/constant');
const { toolFunctions } = require('./utils/toolFunction');
const { tools } = require('./utils/toolDeclarations');

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

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