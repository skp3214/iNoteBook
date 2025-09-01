import { useState, useRef, useEffect } from 'react';
import { faTrash, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Row, Col, Card, Button, Form, InputGroup, Spinner } from 'react-bootstrap';

const AiChat = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hey there! 👋 I'm your personal assistant for iNotebook. I'm here to help make managing your notes super easy - just tell me what you need to remember, and I'll take care of the rest! What can I help you with today?",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
                text: "Hello! I'm your AI assistant for iNotebook. I can help you create, update, delete, search, and manage your notes. How can I help you today?",
                sender: 'ai',
                timestamp: new Date()
            }
        ]);
    };

    return (
        <Container fluid className="d-flex flex-column" style={{
            height: '100vh',
            maxHeight: window.innerWidth <= 768 ? '70vh' : '600px',
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
        </Container>
    );
};

export default AiChat;
