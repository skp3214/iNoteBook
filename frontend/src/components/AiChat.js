import { useState, useRef, useEffect, useCallback } from 'react';
import { faTrash, faPaperPlane, faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Row, Col, Card, Button, Form, InputGroup, Spinner, Modal } from 'react-bootstrap';



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

        console.log('Adding user message to chat:', userMessage);
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            console.log('Sending API request...');
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/ai-agent/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authtoken': localStorage.getItem('token')
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();
            console.log('API response:', data);

            if (data.success) {
                const aiMessage = {
                    id: Date.now() + 1,
                    text: data.response,
                    sender: 'ai',
                    timestamp: new Date()
                };
                console.log('Adding AI response to chat:', aiMessage);
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

                console.log('Speech result - Final:', final, 'Interim:', interim);

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
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/ai-agent/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authtoken': localStorage.getItem('token')
                },
                body: JSON.stringify({ message: inputMessage })
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

    return (
        <Container fluid className="d-flex flex-column" style={{
            height: '100vh',
            maxHeight: window.innerWidth <= 768 ? '70vh' : '750px',
            margin: window.innerWidth <= 768 ? '10px' : '20px',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <Row className="align-items-center border-bottom py-2 px-3" style={{
                background: 'var(--bg-secondary)',
                borderTopLeftRadius: '1rem',
                borderTopRightRadius: '1rem'
            }}>
                <Col xs="auto" className="d-flex align-items-center">
                    <span style={{
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        borderRadius: '50%',
                        width: window.innerWidth <= 768 ? '24px' : '32px',
                        height: window.innerWidth <= 768 ? '24px' : '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: window.innerWidth <= 768 ? '0.75rem' : '1rem'
                    }}>
                        🤖
                    </span>
                    <span className="ms-2" style={{
                        color: 'var(--text-primary)',
                        fontSize: window.innerWidth <= 768 ? '1rem' : '1.25rem'
                    }}>
                        {window.innerWidth <= 768 ? 'AI' : 'AI Assistant'}
                    </span>
                </Col>
                <Col xs="auto" className="ms-auto">
                    <Button
                        variant="outline-secondary"
                        onClick={clearChat}
                        title="Clear chat"
                        className="d-flex align-items-center justify-content-center"
                        style={{
                            borderRadius: '50%',
                            width: window.innerWidth <= 768 ? '32px' : '40px',
                            height: window.innerWidth <= 768 ? '32px' : '40px',
                            padding: 0
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faTrash}
                            style={{
                                color: 'var(--accent-primary)',
                                fontSize: window.innerWidth <= 768 ? '0.75rem' : '0.9rem'
                            }}
                        />
                    </Button>
                </Col>
            </Row>

            {/* Messages */}
            <Row className="flex-grow-1 overflow-auto px-3 py-2" style={{
                background: 'var(--bg-primary)',
                maxHeight: window.innerWidth <= 768 ? 'calc(100vh - 280px)' : 'none',
                minHeight: window.innerWidth <= 768 ? '200px' : 'auto'
            }}>
                <Col>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className="mb-3 d-flex flex-column"
                            style={{
                                maxWidth: window.innerWidth <= 768 ? '90%' : '85%',
                                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start'
                            }}
                        >
                            <Card
                                bg={message.isError ? "danger" : (message.sender === 'user' ? "primary" : "light")}
                                text={message.isError ? "white" : (message.sender === 'user' ? "white" : "dark")}
                                className={`mb-1 ${message.sender === 'user' ? 'align-self-end' : 'align-self-start'}`}
                                style={{
                                    borderRadius: message.sender === 'user'
                                        ? window.innerWidth <= 768 ? '1rem 1rem 0.25rem 1rem' : '1.25rem 1.25rem 0.25rem 1.25rem'
                                        : window.innerWidth <= 768 ? '1rem 1rem 1rem 0.25rem' : '1.25rem 1.25rem 1.25rem 0.25rem',
                                    padding: window.innerWidth <= 768 ? '0.75rem 1rem' : '1rem 1.25rem',
                                    fontSize: window.innerWidth <= 768 ? '0.85rem' : '0.95rem',
                                    wordWrap: 'break-word',
                                    lineHeight: '1.5',
                                    fontFamily: 'Inter, sans-serif'
                                }}
                            >
                                <Card.Body className="p-0">
                                    {formatMessage(message.text)}
                                </Card.Body>
                            </Card>
                            <div style={{
                                fontSize: window.innerWidth <= 768 ? '0.65rem' : '0.75rem',
                                color: 'var(--text-muted)',
                                textAlign: message.sender === 'user' ? 'right' : 'left',
                                fontFamily: 'Inter, sans-serif'
                            }}>
                                {formatTimestamp(message.timestamp)}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="mb-3 d-flex flex-column" style={{
                            maxWidth: window.innerWidth <= 768 ? '90%' : '85%',
                            alignSelf: 'flex-start'
                        }}>
                            <Card
                                bg="light"
                                className="mb-1 align-self-start"
                                style={{
                                    borderRadius: window.innerWidth <= 768 ? '1rem 1rem 1rem 0.25rem' : '1.25rem 1.25rem 1.25rem 0.25rem',
                                    padding: window.innerWidth <= 768 ? '0.75rem 1rem' : '1rem 1.25rem'
                                }}
                            >
                                <Card.Body className="p-0">
                                    <Spinner animation="grow" size="sm" className="me-1" />
                                    <Spinner animation="grow" size="sm" className="me-1" />
                                    <Spinner animation="grow" size="sm" />
                                </Card.Body>
                            </Card>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </Col>
            </Row>

            {/* Input */}
            <Row className="border-top py-2 px-3" style={{
                background: 'var(--bg-secondary)',
                borderBottomLeftRadius: '1rem',
                borderBottomRightRadius: '1rem'
            }}>
                <Col>
                    <InputGroup>
                        <Form.Control
                            as="textarea"
                            ref={inputRef}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={window.innerWidth <= 768 ? "Ask about your notes..." : "Ask me anything about your notes..."}
                            disabled={isLoading}
                            rows={1}
                            style={{
                                resize: 'none',
                                minHeight: window.innerWidth <= 768 ? '40px' : '48px',
                                maxHeight: window.innerWidth <= 768 ? '80px' : '120px',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: window.innerWidth <= 768 ? '0.85rem' : '0.95rem',
                                lineHeight: '1.4'
                            }}
                        />
                        {speechSupported && (
                            <Button
                                variant="outline-secondary"
                                onClick={startListening}
                                disabled={isLoading || isListening}
                                title="Start voice input"
                                style={{
                                    width: window.innerWidth <= 768 ? '40px' : '48px',
                                    height: window.innerWidth <= 768 ? '40px' : '48px'
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faMicrophone}
                                    style={{
                                        color: 'var(--accent-primary)',
                                        fontSize: window.innerWidth <= 768 ? '0.75rem' : '0.9rem'
                                    }}
                                />
                            </Button>
                        )}
                        <Button
                            onClick={sendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            style={{
                                width: window.innerWidth <= 768 ? '40px' : '48px',
                                height: window.innerWidth <= 768 ? '40px' : '48px'
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faPaperPlane}
                                style={{
                                    color: 'white',
                                    fontSize: window.innerWidth <= 768 ? '0.75rem' : '0.9rem'
                                }}
                            />
                        </Button>
                    </InputGroup>
                </Col>
            </Row>

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
        </Container>
    );
};

export default AiChat;
