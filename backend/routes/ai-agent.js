const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const { runAiAgent } = require('../ai-agent/ai-agent');
const router = express.Router();

// AI Agent endpoint
router.post('/chat', fetchuser, async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;

        if (!message || message.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                error: 'Message is required' 
            });
        }

        const response = await runAiAgent(message, userId);
        
        res.json({ 
            success: true, 
            response: response 
        });
    } catch (error) {
        console.error('AI Agent Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error. Please try again later.' 
        });
    }
});

module.exports = router;
