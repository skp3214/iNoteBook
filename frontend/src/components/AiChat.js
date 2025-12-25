import { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import noteContext from '../context/notes/noteContext';
import { handleAuthResponse } from '../utils/authUtils';
import SpeechModal from './ai-chat/SpeechModal';
import AutoExpandingInputField from './ai-chat/AutoExpandingInputField';



const AiChat = () => {
    const context = useContext(noteContext);
    const { getNotes } = context;
    const navigate = useNavigate();
    // Add custom scrollbar styles
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 0, 0, 0.3);
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hey there! 👋 I'm your personal assistant for iNotebook. What can I help you with today?",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);
    const [showSpeechModal, setShowSpeechModal] = useState(false);
    const [speechTranscript, setSpeechTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const recognitionRef = useRef(null);
    const speechTranscriptRef = useRef('');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Auto-resize textarea when inputMessage changes
    useEffect(() => {
        autoResizeTextarea(inputRef.current);
    }, [inputMessage]);

    // Function to send speech message
    const sendSpeechMessage = useCallback(async (message) => {
        console.log('sendSpeechMessage called with:', message);
        if (!message.trim() || isLoading) {
            console.log('Message empty or already loading, returning');
            return;
        }

        const userMessage = {
            id: Date.now(),
            text: message,
            sender: 'user',
            timestamp: new Date()
        };

        console.log('Adding user message to chat');
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            console.log('Sending API request...');
            // Get user API key if available
            const userApiKey = localStorage.getItem('gemini_api_key');

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/ai-agent/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authtoken': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    message: message,
                    ...(userApiKey && { apiKey: userApiKey })
                })
            });

            const isValid = await handleAuthResponse(response, navigate);
            if (!isValid) {
                const errorMessage = {
                    id: Date.now() + 1,
                    text: 'Your session has expired. Please login again.',
                    sender: 'ai',
                    timestamp: new Date(),
                    isError: true
                };
                setMessages(prev => [...prev, errorMessage]);
                return;
            }

            const data = await response.json();
            console.log('API response');

            if (data.success) {
                const aiMessage = {
                    id: Date.now() + 1,
                    text: data.response,
                    sender: 'ai',
                    timestamp: new Date()
                };
                console.log('Adding AI response to chat');
                setMessages(prev => [...prev, aiMessage]);

                // Refresh notes if AI performed CRUD operations
                if (data.response && (data.response.toLowerCase().includes('created') ||
                    data.response.toLowerCase().includes('updated') ||
                    data.response.toLowerCase().includes('deleted') ||
                    data.response.toLowerCase().includes('added'))) {
                    console.log('AI performed CRUD operation, refreshing notes...');
                    setTimeout(() => {
                        if (getNotes) {
                            getNotes();
                        }
                    }, 500);
                }
            } else {
                const errorMessage = {
                    id: Date.now() + 1,
                    text: data.error || 'Sorry, I encountered an error. Please try again.',
                    sender: 'ai',
                    timestamp: new Date(),
                    isError: true
                };
                console.log('Adding error message to chat:', errorMessage);
                setMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            console.error('Network error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                text: 'Sorry, I couldn\'t connect to the server. Please check your connection and try again.',
                sender: 'ai',
                timestamp: new Date(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            console.log('Setting loading to false');
            setIsLoading(false);
        }
    }, [isLoading, getNotes, navigate]);

    // Initialize speech recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setSpeechSupported(true);
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();

            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                console.log('Speech recognition started');
                setIsListening(true);
                setShowSpeechModal(true);
                setSpeechTranscript('');
                setInterimTranscript('');
                speechTranscriptRef.current = '';
            };

            recognitionRef.current.onresult = (event) => {
                let interim = '';
                let final = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        final += transcript;
                    } else {
                        interim += transcript;
                    }
                }

                if (final) {
                    const newTranscript = speechTranscriptRef.current + final;
                    speechTranscriptRef.current = newTranscript;
                    setSpeechTranscript(newTranscript);
                    setInterimTranscript('');
                } else {
                    setInterimTranscript(interim);
                }
            };

            recognitionRef.current.onend = () => {
                console.log('Speech recognition ended. Transcript:', speechTranscriptRef.current);
                setIsListening(false);

                // Auto-send the message if we have a transcript
                const finalTranscript = speechTranscriptRef.current.trim();
                if (finalTranscript) {
                    console.log('Auto-sending message:', finalTranscript);
                    // Show the transcript for a moment before sending
                    setTimeout(() => {
                        sendSpeechMessage(finalTranscript);
                        setShowSpeechModal(false);
                        setSpeechTranscript('');
                        setInterimTranscript('');
                        speechTranscriptRef.current = '';
                    }, 1000); // Show for 1 second before sending
                } else {
                    console.log('No transcript to send');
                    setShowSpeechModal(false);
                    setSpeechTranscript('');
                    setInterimTranscript('');
                    speechTranscriptRef.current = '';
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                setShowSpeechModal(false);
                setSpeechTranscript('');
                setInterimTranscript('');
                speechTranscriptRef.current = '';

                if (event.error === 'not-allowed') {
                    alert('Microphone access denied. Please allow microphone access and try again.');
                } else if (event.error === 'no-speech') {
                    alert('No speech detected. Please try speaking and try again.');
                } else {
                    alert(`Speech recognition error: ${event.error}. Please try again.`);
                }
            };
        }
    }, [sendSpeechMessage]);

    // Initialize textarea height on component mount
    useEffect(() => {
        if (inputRef.current) {
            const textarea = inputRef.current;
            textarea.style.height = '48px'; // Set initial height
        }
    }, []);

    // Auto-resize function
    const autoResizeTextarea = (textarea) => {
        if (textarea) {
            // Store current scroll position
            const cursorPosition = textarea.selectionStart;

            // Reset height to calculate scroll height
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            const maxHeight = 120;
            const minHeight = 48;

            if (scrollHeight <= maxHeight) {
                // Content fits within max height, expand textarea
                textarea.style.height = Math.max(minHeight, scrollHeight) + 'px';
                textarea.style.overflowY = 'hidden';
            } else {
                // Content exceeds max height, set to max and enable scrolling
                textarea.style.height = maxHeight + 'px';
                textarea.style.overflowY = 'auto';

                // Auto-scroll to bottom when typing
                setTimeout(() => {
                    textarea.scrollTop = textarea.scrollHeight;
                }, 0);
            }

            // Restore cursor position
            textarea.setSelectionRange(cursorPosition, cursorPosition);
        }
    };

    const startListening = () => {
        if (recognitionRef.current && speechSupported && !isListening) {
            try {
                recognitionRef.current.start();
            } catch (error) {
                console.error('Error starting speech recognition:', error);
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    };

    const handleModalClose = () => {
        if (isListening) {
            stopListening();
        } else {
            setShowSpeechModal(false);
            setSpeechTranscript('');
            setInterimTranscript('');
        }
    };

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        // Reset textarea height after sending message
        setTimeout(() => autoResizeTextarea(inputRef.current), 0);
        setIsLoading(true);

        try {
            // Get user API key if available
            const userApiKey = localStorage.getItem('gemini_api_key');

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/ai-agent/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authtoken': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    message: inputMessage,
                    ...(userApiKey && { apiKey: userApiKey })
                })
            });

            const isValid = await handleAuthResponse(response, navigate);
            if (!isValid) {
                const errorMessage = {
                    id: Date.now() + 1,
                    text: 'Your session has expired. Please login again.',
                    sender: 'ai',
                    timestamp: new Date(),
                    isError: true
                };
                setMessages(prev => [...prev, errorMessage]);
                setIsLoading(false);
                return;
            }

            const data = await response.json();

            if (data.success) {
                const aiMessage = {
                    id: Date.now() + 1,
                    text: data.response,
                    sender: 'ai',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, aiMessage]);

                // Refresh notes if AI performed CRUD operations
                if (data.response && (data.response.toLowerCase().includes('created') ||
                    data.response.toLowerCase().includes('updated') ||
                    data.response.toLowerCase().includes('deleted') ||
                    data.response.toLowerCase().includes('added'))) {
                    console.log('AI performed CRUD operation, refreshing notes...');
                    setTimeout(() => {
                        if (getNotes) {
                            getNotes();
                        }
                    }, 500);
                }
            } else {
                const errorMessage = {
                    id: Date.now() + 1,
                    text: data.error || 'Sorry, I encountered an error. Please try again.',
                    sender: 'ai',
                    timestamp: new Date(),
                    isError: true
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            const errorMessage = {
                id: Date.now() + 1,
                text: 'Sorry, I couldn\'t connect to the server. Please check your connection and try again.',
                sender: 'ai',
                timestamp: new Date(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatMessage = (text) => {
        const lines = text.split('\n');
        const formattedElements = [];

        lines.forEach((line, index) => {
            // Handle bullet points
            if (line.trim().startsWith('* ')) {
                const content = line.substring(2).trim();

                // Handle bold text within bullet points (e.g., **text**)
                const formattedContent = content.split(/(\*\*[^*]+\*\*)/g).map((part, partIndex) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return (
                            <strong key={partIndex} style={{
                                fontWeight: 600,
                                color: 'var(--accent-primary, #007bff)'
                            }}>
                                {part.slice(2, -2)}
                            </strong>
                        );
                    }
                    return part;
                });

                formattedElements.push(
                    <div key={index} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginBottom: '0.5rem',
                        paddingLeft: '0.5rem'
                    }}>
                        <span style={{
                            marginRight: '0.5rem',
                            color: 'var(--accent-primary, #007bff)',
                            fontWeight: 'bold',
                            minWidth: '8px'
                        }}>•</span>
                        <span style={{ lineHeight: '1.5' }}>{formattedContent}</span>
                    </div>
                );
            }
            // Handle headers (lines that end with colon)
            else if (line.trim().endsWith(':') && line.trim().length > 1 && !line.includes('*')) {
                formattedElements.push(
                    <div key={index} style={{
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        color: 'var(--text-primary)',
                        marginBottom: '0.75rem',
                        marginTop: index > 0 ? '1rem' : '0',
                        borderBottom: '1px solid var(--border-light)',
                        paddingBottom: '0.25rem'
                    }}>
                        {line.trim()}
                    </div>
                );
            }
            // Handle empty lines
            else if (line.trim() === '') {
                formattedElements.push(
                    <div key={index} style={{ height: '0.75rem' }} />
                );
            }
            // Handle regular text with bold formatting
            else if (line.trim()) {
                const formattedContent = line.split(/(\*\*[^*]+\*\*)/g).map((part, partIndex) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return (
                            <strong key={partIndex} style={{
                                fontWeight: 600,
                                color: 'var(--accent-primary, #007bff)'
                            }}>
                                {part.slice(2, -2)}
                            </strong>
                        );
                    }
                    return part;
                });

                formattedElements.push(
                    <div key={index} style={{
                        marginBottom: '0.5rem',
                        lineHeight: '1.6'
                    }}>
                        {formattedContent}
                    </div>
                );
            }
        });

        return <div style={{ fontSize: '0.95rem' }}>{formattedElements}</div>;
    };

    const clearChat = () => {
        setMessages([
            {
                id: 1,
                text: "Hello! I'm your AI assistant for iNotebook. How can I help you today?",
                sender: 'ai',
                timestamp: new Date()
            }
        ]);
    };

    // Expose clearChat function globally for the modal header
    useEffect(() => {
        window.clearAiChat = clearChat;
        return () => {
            delete window.clearAiChat;
        };
    }, []);

    return (
        <div className="d-flex flex-column h-100" style={{
            height: '100%',
            overflow: 'hidden'
        }}>
            {/* Messages Container - Scrollable */}
            <div
                className="flex-grow-1 px-3 pt-3"
                style={{
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    maxHeight: 'calc(100% - 80px)', // Reserve space for input
                    background: 'var(--bg-primary)'
                }}
            >
                {messages.map((message) => (
                    <div key={message.id} className="mb-3 d-flex" style={{
                        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                    }}>
                        <div style={{ maxWidth: '85%' }}>
                            <div
                                style={{
                                    background: message.sender === 'user'
                                        ? 'linear-gradient(135deg, var(--accent-primary, #007bff), var(--accent-secondary, #0056b3))'
                                        : message.isError
                                            ? 'var(--danger, #dc3545)'
                                            : 'var(--bg-secondary, #f8f9fa)',
                                    color: message.sender === 'user' || message.isError ? 'white' : 'var(--text-primary)',
                                    borderRadius: message.sender === 'user'
                                        ? '1.25rem 1.25rem 0.25rem 1.25rem'
                                        : '1.25rem 1.25rem 1.25rem 0.25rem',
                                    border: message.sender === 'ai' && !message.isError ? '1px solid var(--border-light)' : 'none',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                    padding: '1rem 1.25rem',
                                    position: 'relative'
                                }}
                            >
                                {/* Message content */}
                                <div style={{
                                    marginBottom: message.sender === 'ai' ? '0.75rem' : '0.5rem'
                                }}>
                                    {formatMessage(message.text)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="mb-3 d-flex">
                        <div style={{ maxWidth: '85%' }}>
                            <div style={{
                                background: 'var(--bg-secondary, #f8f9fa)',
                                border: '1px solid var(--border-light)',
                                borderRadius: '1.25rem 1.25rem 1.25rem 0.25rem',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                padding: '1rem 1.25rem',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <Spinner animation="grow" size="sm" className="me-1" style={{ color: 'var(--accent-primary)' }} />
                                <Spinner animation="grow" size="sm" className="me-1" style={{ color: 'var(--accent-primary)', animationDelay: '0.15s' }} />
                                <Spinner animation="grow" size="sm" className="me-2" style={{ color: 'var(--accent-primary)', animationDelay: '0.3s' }} />
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    AI is thinking...
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Section - Fixed at Bottom */}
            <div
                className="border-top p-3"
                style={{
                    background: 'var(--bg-secondary)',
                    minHeight: '80px',
                    flexShrink: 0
                }}
            >
                <AutoExpandingInputField
                    inputRef={inputRef}
                    isLoading={isLoading}
                    inputMessage={inputMessage}
                    setInputMessage={setInputMessage}
                    autoResizeTextarea={autoResizeTextarea}
                    handleKeyPress={handleKeyPress}
                    sendMessage={sendMessage}
                    speechSupported={speechSupported}
                    isListening={isListening}
                    stopListening={stopListening}
                    startListening={startListening}
                />
            </div>
            {/* Speech Recognition Modal */}
            <SpeechModal
                showSpeechModal={showSpeechModal}
                handleModalClose={handleModalClose}
                speechTranscript={speechTranscript}
                stopListening={stopListening}
                isListening={isListening}
                interimTranscript={interimTranscript}
            />
        </div>
    );
};

export default AiChat;
