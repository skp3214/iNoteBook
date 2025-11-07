const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const { runAiAgent } = require('../ai-agent/ai-agent');
const router = express.Router();

// AI Agent endpoint
router.post('/chat', fetchuser, async (req, res) => {
    try {
        const { message, apiKey } = req.body;
        const userId = req.user.id;

        if (!message || message.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                error: 'Message is required' 
            });
        }

        const response = await runAiAgent(message, userId, 'default', apiKey);
        
        res.json({ 
            success: true, 
            response: response 
        });
    } catch (error) {
        console.error('AI Agent Error:', error);
        
        // Check if it's an API key related error
        if (error.message && (error.message.includes('API key') || error.message.includes('401') || error.message.includes('403'))) {
            return res.status(401).json({ 
                success: false, 
                error: 'API key invalid or expired. Please configure a new API key.',
                requiresApiKey: true
            });
        }
        
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error. Please try again later. Try using personal gemini api key' 
        });
    }
});

module.exports = router;
