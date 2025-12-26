import { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import noteContext from '../context/notes/noteContext';
import { handleAuthResponse } from '../utils/authUtils';
import SpeechModal from './ai-chat/SpeechModal';
import AutoExpandingInputField from './ai-chat/AutoExpandingInputField';
import LoadingSpinner from './ai-chat/LoadingSpinner';
import { autoResizeTextarea, formatMessage } from '../utils/noteUtils';

const AiChat = () => {
    const context = useContext(noteContext);
    const { getNotes } = context;
    const navigate = useNavigate();

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

    useEffect(() => {
        autoResizeTextarea(inputRef.current);
    }, [inputMessage]);

    // Unified message sending logic (text or speech)
    const handleSendMessage = useCallback(async (messageText) => {
        if (!messageText?.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text: messageText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const userApiKey = localStorage.getItem('gemini_api_key');

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/ai-agent/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authtoken': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    message: messageText,
                    ...(userApiKey && { apiKey: userApiKey })
                })
            });

            // This now returns parsed data + auth info
            const authResult = await handleAuthResponse(response, navigate);

            if (!authResult.isValid) {
                const errorText = authResult.isApiKeyError
                    ? authResult.message
                    : 'Your session has expired. Please login again.';

                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: errorText,
                    sender: 'ai',
                    timestamp: new Date(),
                    isError: true
                }]);
                setIsLoading(false);
                return;
            }

            // Use the already-parsed data from handleAuthResponse
            const data = authResult.data;

            if (data.success) {
                const aiMessage = {
                    id: Date.now() + 1,
                    text: data.response,
                    sender: 'ai',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, aiMessage]);

                if (data.response && /\b(created|updated|deleted|added)\b/i.test(data.response)) {
                    setTimeout(() => getNotes?.(), 500);
                }
            } else {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: data.error || 'Sorry, something went wrong. Please try again.',
                    sender: 'ai',
                    timestamp: new Date(),
                    isError: true
                }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: 'Network error. Please check your connection and try again.',
                sender: 'ai',
                timestamp: new Date(),
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, getNotes, navigate]);
    // Text input send
    const sendMessage = () => {
        handleSendMessage(inputMessage);
        setInputMessage('');
        setTimeout(() => autoResizeTextarea(inputRef.current), 0);
    };

    // Speech send
    const sendSpeechMessage = useCallback((transcript) => {
        handleSendMessage(transcript);
    }, [handleSendMessage]);

    // Speech Recognition Setup
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setSpeechSupported(true);
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();

            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                setShowSpeechModal(true);
                setSpeechTranscript('');
                setInterimTranscript('');
                speechTranscriptRef.current = '';
            };

            recognitionRef.current.onresult = (event) => {
                let interim = '';
                let final = speechTranscriptRef.current;

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        final += transcript;
                    } else {
                        interim += transcript;
                    }
                }

                speechTranscriptRef.current = final;
                setSpeechTranscript(final);
                setInterimTranscript(interim);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
                const finalTranscript = speechTranscriptRef.current.trim();

                if (finalTranscript) {
                    setTimeout(() => {
                        sendSpeechMessage(finalTranscript);
                        setShowSpeechModal(false);
                        setSpeechTranscript('');
                        setInterimTranscript('');
                        speechTranscriptRef.current = '';
                    }, 1000);
                } else {
                    setShowSpeechModal(false);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech error:', event.error);
                setIsListening(false);
                setShowSpeechModal(false);
                alert(
                    event.error === 'not-allowed'
                        ? 'Microphone access denied. Please allow it.'
                        : `Speech error: ${event.error}`
                );
            };
        }
    }, [sendSpeechMessage]);

    // Initial textarea height
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = '48px';
        }
    }, []);

    const startListening = () => {
        if (recognitionRef.current && speechSupported && !isListening) {
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    };

    const handleModalClose = () => {
        if (isListening) stopListening();
        setShowSpeechModal(false);
        setSpeechTranscript('');
        setInterimTranscript('');
    };

    const clearChat = () => {
        setMessages([{
            id: 1,
            text: "Hello! I'm your AI assistant for iNotebook. How can I help you today?",
            sender: 'ai',
            timestamp: new Date()
        }]);
    };

    // Optional: Keep window.clearAiChat if SpeechModal uses it (better to pass as prop later)
    useEffect(() => {
        window.clearAiChat = clearChat;
        return () => delete window.clearAiChat;
    }, []);

    return (
        <div className="d-flex flex-column h-100" style={{ height: '100%', overflow: 'hidden' }}>
            {/* Messages Area */}
            <div
                className="flex-grow-1 px-3 pt-3"
                style={{
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    maxHeight: 'calc(100% - 80px)',
                    background: 'var(--bg-primary)'
                }}
            >
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className="mb-3 d-flex"
                        style={{ justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}
                    >
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
                                }}
                            >
                                <div style={{ marginBottom: message.sender === 'ai' ? '0.75rem' : '0.5rem' }}>
                                    {formatMessage(message.text || '')}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && <LoadingSpinner />}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
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
                    sendMessage={sendMessage}
                    speechSupported={speechSupported}
                    isListening={isListening}
                    startListening={startListening}
                    stopListening={stopListening}
                />
            </div>

            {/* Speech Modal */}
            <SpeechModal
                showSpeechModal={showSpeechModal}
                handleModalClose={handleModalClose}
                speechTranscript={speechTranscript}
                interimTranscript={interimTranscript}
                isListening={isListening}
                stopListening={stopListening}
            />
        </div>
    );
};

export default AiChat;