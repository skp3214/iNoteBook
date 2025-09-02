import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AiChat from '../components/AiChat';

const AiAssistant = () => {
    return (
        <Container fluid className="mt-1">
            <Row>
                <Col>
                    <AiChat />
                </Col>
            </Row>
        </Container>
    );
};

export default AiAssistant;
