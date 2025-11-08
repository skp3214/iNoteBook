import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [emailSent, setEmailSent] = useState(false);
    const [resetToken, setResetToken] = useState('');
    const history = useNavigate();

    // Redirect to home if user is already logged in
    useEffect(() => {
        if (localStorage.getItem('token')) {
            history('/');
        }
    }, [history]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setShowAlert(false);

        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
        try {
            const response = await fetch(`${apiBaseUrl}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const json = await response.json();

            if (json.success) {
                setMessage(json.message);
                setAlertType('success');
                setEmailSent(true);
                // If development mode and token is provided
                if (json.resetToken) {
                    setResetToken(json.resetToken);
                }
            } else {
                setMessage(json.message || 'User not found');
                setAlertType('danger');
            }
            setShowAlert(true);
        } catch (error) {
            setMessage('Something went wrong. Please try again.');
            setAlertType('danger');
            setShowAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100">
            <Row className="w-100">
                <Col md={6} lg={4} className="mx-auto">
                    <Card className="modern-card-elevated shadow-lg">
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <h2 className="modern-title mb-2">Forgot Password</h2>
                                <p className="text-muted">
                                    {emailSent ? 'Check your email' : 'Enter your email to reset your password'}
                                </p>
                            </div>

                            {showAlert && (
                                <Alert variant={alertType} className="modern-alert">
                                    {message}
                                    {resetToken && (
                                        <div className="mt-3">
                                            <strong>Development Token:</strong>
                                            <div className="bg-light p-2 rounded mt-1 font-monospace small">
                                                {resetToken}
                                            </div>
                                            <small className="text-muted">
                                                Copy this token for development testing.
                                            </small>
                                        </div>
                                    )}
                                    {emailSent && !resetToken && (
                                        <div className="mt-3">
                                            <small className="text-muted">
                                                <strong>Didn't receive the email?</strong>
                                                <br />• Check your spam/junk folder
                                                <br />• Make sure you entered the correct email
                                                <br />• The link expires in 1 hour
                                            </small>
                                        </div>
                                    )}
                                </Alert>
                            )}

                            {!emailSent && (
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="modern-text fw-medium">Email Address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="modern-input"
                                            required
                                        />
                                    </Form.Group>

                                    <Button
                                        type="submit"
                                        className="modern-btn modern-btn-solid w-100 mb-3"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Sending...
                                            </>
                                        ) : (
                                            'Send Reset Email'
                                        )}
                                    </Button>
                                </Form>
                            )}

                            <div className="text-center">
                                <Link to="/login" className="modern-link">
                                    Back to Login
                                </Link>
                                {emailSent && (
                                    <>
                                        <span className="mx-2">•</span>
                                        <button 
                                            className="btn btn-link p-0 modern-link"
                                            onClick={() => {
                                                setEmailSent(false);
                                                setShowAlert(false);
                                                setEmail('');
                                                setResetToken('');
                                            }}
                                        >
                                            Try Different Email
                                        </button>
                                        {resetToken && (
                                            <>
                                                <span className="mx-2">•</span>
                                                <Link to="/reset-password" className="modern-link">
                                                    Reset Password
                                                </Link>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPassword;
