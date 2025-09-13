import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        token: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [hasUrlToken, setHasUrlToken] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const urlToken = searchParams.get('token');
        if (urlToken) {
            setFormData(prev => ({ ...prev, token: urlToken }));
            setHasUrlToken(true);
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setShowAlert(false);

        if (formData.password !== formData.confirmPassword) {
            setMessage('Passwords do not match');
            setAlertType('danger');
            setShowAlert(true);
            setIsLoading(false);
            return;
        }

        if (!formData.token) {
            setMessage('Reset token is required');
            setAlertType('danger');
            setShowAlert(true);
            setIsLoading(false);
            return;
        }

        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
        try {
            const response = await fetch(`${apiBaseUrl}/api/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    token: formData.token, 
                    password: formData.password 
                }),
            });
            const json = await response.json();

            if (json.success) {
                setMessage('Password reset successful! Redirecting to login...');
                setAlertType('success');
                setShowAlert(true);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMessage(json.message || 'Invalid or expired reset token');
                setAlertType('danger');
                setShowAlert(true);
            }
        } catch (error) {
            setMessage('Something went wrong. Please try again.');
            setAlertType('danger');
            setShowAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

    const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100">
            <Row className="w-100">
                <Col md={6} lg={4} className="mx-auto">
                    <Card className="modern-card-elevated shadow-lg">
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <h2 className="modern-title mb-2">Reset Password</h2>
                                <p className="text-muted">
                                    {hasUrlToken ? 'Enter your new password' : 'Enter reset token and new password'}
                                </p>
                            </div>

                            {showAlert && (
                                <Alert variant={alertType} className="modern-alert">
                                    {message}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                {!hasUrlToken && (
                                    <Form.Group className="mb-3">
                                        <Form.Label className="modern-text fw-medium">Reset Token</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="token"
                                            placeholder="Enter reset token"
                                            value={formData.token}
                                            onChange={onChange}
                                            className="modern-input font-monospace"
                                            required
                                        />
                                        <Form.Text className="text-muted">
                                            Enter the reset token from your email or development console
                                        </Form.Text>
                                    </Form.Group>
                                )}

                                <Form.Group className="mb-3">
                                    <Form.Label className="modern-text fw-medium">New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Enter new password"
                                        value={formData.password}
                                        onChange={onChange}
                                        className="modern-input"
                                        minLength={5}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="modern-text fw-medium">Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm new password"
                                        value={formData.confirmPassword}
                                        onChange={onChange}
                                        className="modern-input"
                                        minLength={5}
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
                                            Resetting...
                                        </>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </Button>
                            </Form>

                            <div className="text-center">
                                <Link to="/login" className="modern-link">
                                    Back to Login
                                </Link>
                                <span className="mx-2">•</span>
                                <Link to="/forgot-password" className="modern-link">
                                    Request New Reset
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ResetPassword;
