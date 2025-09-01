# iNotebook AI Agent

An intelligent AI assistant built for the iNotebook application that helps users perform CRUD operations on their notes through natural language conversations.

## Features

### 🤖 AI-Powered Note Management
- **Create Notes**: Ask the AI to create new notes with titles, descriptions, and tags
- **Read Notes**: Retrieve and display all your notes or search for specific ones
- **Update Notes**: Modify existing notes by providing the note ID and new content
- **Delete Notes**: Remove notes by specifying the note ID
- **Search Notes**: Find notes by keywords in title, description, or tags

### 💬 Natural Language Interface
- Conversational UI with chat bubbles
- Typing indicators for better UX
- Suggested prompts for new users
- Error handling with user-friendly messages

### 🎨 Modern UI Design
- Glassmorphism design with gradient backgrounds
- Responsive design for mobile and desktop
- Dark/Light mode support
- Smooth animations and transitions

## Installation

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install @google/genai
   ```

2. **Environment Configuration**
   Add the following to your `.env` file:
   ```bash
   GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   ```

3. **Get Google AI API Key**
   - Visit [Google AI Studio](https://ai.google.dev/)
   - Create a new project or use existing one
   - Generate an API key for Gemini
   - Add the key to your `.env` file

### Frontend Setup

The frontend components are already included. No additional setup required.

## Usage Examples

### Creating Notes
```
User: "Create a note about my meeting tomorrow with title 'Team Meeting' and description 'Discuss Q4 roadmap and budget planning'"

AI: "I've successfully created a new note titled 'Team Meeting' with your description about discussing Q4 roadmap and budget planning."
```

### Fetching Notes
```
User: "Show me all my notes"

AI: "Here are all your notes:
1. Team Meeting - Discuss Q4 roadmap and budget planning (Tag: General)
2. Shopping List - Buy groceries for the week (Tag: Personal)
..."
```

### Searching Notes
```
User: "Search for notes about meetings"

AI: "I found 3 notes related to meetings:
1. Team Meeting - Discuss Q4 roadmap and budget planning
2. Client Meeting - Present project proposal
3. Weekly Standup - Review sprint progress"
```

### Updating Notes
```
User: "Update note with ID 507f1f77bcf86cd799439011 to have title 'Updated Meeting Notes'"

AI: "I've successfully updated the note. The title has been changed to 'Updated Meeting Notes'."
```

### Deleting Notes
```
User: "Delete the note with ID 507f1f77bcf86cd799439011"

AI: "The note has been successfully deleted from your notebook."
```

## Technical Architecture

### Backend Components

1. **AI Agent (`ai-agent/ai-agent.js`)**
   - Integrates with Google's Gemini AI
   - Handles natural language processing
   - Manages tool function calls for CRUD operations

2. **API Routes (`routes/ai-agent.js`)**
   - RESTful endpoint for AI chat interactions
   - Authentication middleware integration
   - Error handling and response formatting

3. **Tool Functions**
   - `createNote`: Creates new notes
   - `fetchAllNotes`: Retrieves user's notes
   - `updateNote`: Modifies existing notes
   - `deleteNote`: Removes notes
   - `searchNotes`: Finds notes by keywords

### Frontend Components

1. **AiChat Component (`components/AiChat.js`)**
   - Chat interface with message history
   - Real-time typing indicators
   - Suggested prompts for new users

2. **AiAssistant Page (`pages/AiAssistant.js`)**
   - Full-page layout for AI chat
   - Navigation integration

3. **Styling (`components/AiChat.css`)**
   - Modern glassmorphism design
   - Responsive layout
   - Smooth animations

## API Endpoints

### POST `/api/ai-agent/chat`
Sends a message to the AI agent and receives a response.

**Headers:**
- `authtoken`: JWT token for authentication
- `Content-Type`: application/json

**Request Body:**
```json
{
  "message": "Create a note about my shopping list"
}
```

**Response:**
```json
{
  "success": true,
  "response": "I've successfully created a new note titled 'Shopping List' for you."
}
```

## Error Handling

The AI agent includes comprehensive error handling for:
- Invalid API keys
- Network connectivity issues
- Database operation failures
- Invalid note IDs
- Unauthorized access attempts

## Security Features

- **Authentication Required**: All AI operations require valid JWT tokens
- **User Isolation**: Notes are filtered by user ID to ensure privacy
- **Input Validation**: All user inputs are validated before processing
- **Rate Limiting**: Recommended to implement rate limiting for production use

## Customization

### Adding New Functions
To add new AI capabilities, extend the `toolFunctions` object and `tools` array in `ai-agent.js`:

```javascript
// Add to toolFunctions
const toolFunctions = {
    // existing functions...
    newFunction: async ({ param1, param2 }) => {
        // implementation
    }
};

// Add to tools configuration
const tools = [
    {
        functionDeclarations: [
            // existing declarations...
            {
                name: "newFunction",
                description: "Description of the new function",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        param1: { type: Type.STRING, description: "Parameter description" }
                    },
                    required: ["param1"]
                }
            }
        ]
    }
];
```

### Modifying AI Behavior
Update the `systemInstruction` in the `runAiAgent` function to change how the AI responds to user queries.

## Troubleshooting

### Common Issues

1. **"Google AI API Key not found"**
   - Ensure `GOOGLE_AI_API_KEY` is set in your `.env` file
   - Verify the API key is valid and has proper permissions

2. **"Note not found" errors**
   - Check that the note ID is correct
   - Ensure the user has permission to access the note

3. **Chat not loading**
   - Verify the backend server is running
   - Check that the API base URL is correct in frontend environment

### Debug Mode
Enable detailed logging by adding debug statements in the AI agent:

```javascript
console.log('AI Agent Request:', userPrompt);
console.log('Tool Response:', toolResponse);
```

## Contributing

When contributing to the AI agent:

1. Follow existing code patterns and naming conventions
2. Add comprehensive error handling for new functions
3. Update this README with new features
4. Test with various natural language inputs
5. Ensure proper user authentication and authorization

