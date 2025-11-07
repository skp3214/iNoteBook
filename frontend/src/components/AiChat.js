import { useState, useRef, useEffect, useCallback } from 'react';
import { faPaperPlane, faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Button, Form, Spinner, Modal } from 'react-bootstrap';



const AiChat = () => {
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
    }, [isLoading]);

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

            const data = await response.json();

            if (data.success) {
                const aiMessage = {
                    id: Date.now() + 1,
                    text: data.response,
                    sender: 'ai',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, aiMessage]);
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
        return text.split('\n').map((line, index) => (
            <span key={index}>
                {line}
                {index < text.split('\n').length - 1 && <br />}
            </span>
        ));
    };

    const formatTimestamp = (timestamp) => {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                            <Card
                                bg={message.sender === 'user' ? 'primary' : (message.isError ? 'danger' : 'light')}
                                text={message.sender === 'user' || message.isError ? 'white' : 'dark'}
                                style={{
                                    borderRadius: message.sender === 'user'
                                        ? '1.25rem 1.25rem 0.25rem 1.25rem'
                                        : '1.25rem 1.25rem 1.25rem 0.25rem',
                                    border: 'none',
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            >
                                <Card.Body style={{ padding: '1rem' }}>
                                    <div style={{
                                        fontSize: '0.95rem',
                                        lineHeight: '1.6',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {formatMessage(message.text)}
                                    </div>
                                    <small style={{
                                        fontSize: '0.75rem',
                                        color: message.sender === 'user' || message.isError ? 'rgba(255, 255, 255, 0.6)' : 'gray'
                                    }}>
                                        {formatTimestamp(message.timestamp)}
                                    </small>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="mb-3 d-flex">
                        <div style={{ maxWidth: '85%' }}>
                            <Card bg="light" style={{
                                borderRadius: '1.25rem 1.25rem 1.25rem 0.25rem',
                                border: 'none',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                <Card.Body style={{ padding: '1rem' }}>
                                    <Spinner animation="grow" size="sm" className="me-1" />
                                    <Spinner animation="grow" size="sm" className="me-1" />
                                    <Spinner animation="grow" size="sm" />
                                </Card.Body>
                            </Card>
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
                <div className="position-relative">
                    <Form.Control
                        as="textarea"
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask me anything about your notes..."
                        disabled={isLoading}
                        rows={1}
                        style={{
                            resize: 'none',
                            borderRadius: '25px',
                            paddingLeft: '1.25rem',
                            paddingRight: speechSupported ? '5rem' : '3.5rem',
                            paddingTop: '0.875rem',
                            paddingBottom: '0.875rem',
                            fontSize: '1rem',
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-light)',
                            color: 'var(--text-primary)',
                            maxHeight: '120px',
                            minHeight: '48px'
                        }}
                    />
                    {speechSupported && (
                        <Button
                            variant={isListening ? "danger" : "outline-secondary"}
                            onClick={isListening ? stopListening : startListening}
                            disabled={isLoading}
                            style={{
                                position: 'absolute',
                                right: '55px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 5,
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: isListening ? 'var(--danger)' : 'transparent'
                            }}
                            title={isListening ? "Stop recording" : "Voice input"}
                        >
                            <FontAwesomeIcon
                                icon={isListening ? faMicrophoneSlash : faMicrophone}
                                style={{
                                    fontSize: '1rem',
                                    color: isListening ? 'white' : 'var(--text-muted)'
                                }}
                            />
                        </Button>
                    )}
                    <Button
                        onClick={sendMessage}
                        disabled={isLoading || !inputMessage.trim()}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 5,
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            background: inputMessage.trim() && !isLoading ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'var(--bg-tertiary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faPaperPlane}
                            style={{
                                fontSize: '1rem',
                                color: inputMessage.trim() && !isLoading ? 'white' : 'var(--text-muted)'
                            }}
                        />
                    </Button>
                </div>
            </div>

            {/* Speech Recognition Modal */}
            <Modal
                show={showSpeechModal}
                onHide={handleModalClose}
                centered
                backdrop="static"
                className="modern-modal"
            >
                <Modal.Header closeButton style={{ 
                    background: 'var(--bg-secondary)',
                    borderBottom: '1px solid var(--border-light)'
                }}>
                    <Modal.Title className="d-flex align-items-center">
                        <FontAwesomeIcon 
                            icon={faMicrophone} 
                            className={`me-2 ${isListening ? 'animate-pulse' : ''}`}
                            style={{ 
                                color: isListening ? 'var(--danger)' : 'var(--accent-primary)',
                                fontSize: '1.25rem'
                            }}
                        />
                        {isListening ? 'Listening...' : 'Speech Recognition'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ 
                    background: 'var(--bg-primary)',
                    minHeight: '200px',
                    padding: '2rem'
                }}>
                    <div className="text-center mb-3">
                        <p style={{ 
                            color: 'var(--text-secondary)',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.9rem'
                        }}>
                            {isListening 
                                ? 'Speak clearly into your microphone...' 
                                : speechTranscript 
                                ? 'Processing your speech...'
                                : 'Getting ready to listen...'}
                        </p>
                    </div>
                    
                    <div style={{
                        background: 'var(--bg-secondary)',
                        border: '2px solid var(--border-light)',
                        borderRadius: 'var(--border-radius)',
                        padding: '1.5rem',
                        minHeight: '120px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        color: 'var(--text-primary)',
                        position: 'relative'
                    }}>
                        {speechTranscript && (
                            <div>
                                <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                                    {speechTranscript}
                                </span>
                                {!isListening && (
                                    <div style={{ 
                                        marginTop: '1rem',
                                        padding: '0.5rem',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        color: 'var(--accent-primary)',
                                        textAlign: 'center'
                                    }}>
                                        Sending message automatically...
                                    </div>
                                )}
                            </div>
                        )}
                        {interimTranscript && (
                            <span style={{ 
                                color: 'var(--text-muted)',
                                fontStyle: 'italic' 
                            }}>
                                {interimTranscript}
                            </span>
                        )}
                        {!speechTranscript && !interimTranscript && (
                            <span style={{ 
                                color: 'var(--text-muted)',
                                fontStyle: 'italic' 
                            }}>
                                Your speech will appear here...
                            </span>
                        )}
                    </div>

                    {isListening && (
                        <div className="text-center mt-3">
                            <Button
                                variant="danger"
                                onClick={stopListening}
                                className="modern-btn"
                                style={{
                                    borderRadius: '25px',
                                    padding: '0.75rem 1.5rem',
                                    fontWeight: '600'
                                }}
                            >
                                <FontAwesomeIcon icon={faMicrophoneSlash} className="me-2" />
                                Stop Listening
                            </Button>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AiChat;
