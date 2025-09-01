import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AiChat from '../components/AiChat';

const AiAssistant = () => {
    return (
        <Container fluid className="mt-3">
            <Row>
                <Col>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="mb-0">
                            <i className="fas fa-robot me-2"></i>
                            AI Assistant
                        </h2>
                        <small className="text-muted">
                            Chat with AI to manage your notes efficiently
                        </small>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <AiChat />
                </Col>
            </Row>
        </Container>
    );
};

export default AiAssistant;
