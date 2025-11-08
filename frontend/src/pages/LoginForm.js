import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Spinner, Card } from 'react-bootstrap';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        password: '',
        email: '',
    });
    const [isSigningIn, setisSigningIn] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const history = useNavigate();

    // Redirect to home if user is already logged in
    useEffect(() => {
        if (localStorage.getItem('token')) {
            history('/home');
        }
    }, [history]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setisSigningIn(true);
        setShowAlert(false);

        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
        try {
            const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            });
            const json = await response.json();

            if (json.success) {
                localStorage.setItem('token', json.authtoken);
                history('/home');
            } else {
                setShowAlert(true);
            }
        } catch (error) {
            setShowAlert(true);
        } finally {
            setisSigningIn(false);
        }
    };

    const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5} xl={4}>
                    <Card className="modern-card-elevated">
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <h3 className="modern-title mb-2">Welcome Back</h3>
                                <p className="modern-text text-muted">
                                    Sign in to access your notes
                                </p>
                            </div>

                            {showAlert && (
                                <div className="modern-alert alert-danger mb-4">
                                    <strong>Login failed.</strong> Please check your email and password.
                                </div>
                            )}
                            
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label className="modern-text fw-medium mb-2">Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={onChange}
                                        className="modern-input"
                                        required
                                        disabled={isSigningIn}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="formPassword">
                                    <Form.Label className="modern-text fw-medium mb-2">Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={onChange}
                                        className="modern-input"
                                        required
                                        disabled={isSigningIn}
                                    />
                                </Form.Group>

                <Button
                  type="submit"
                  className="modern-btn modern-btn-solid w-100 py-3 mb-4"
                  disabled={isSigningIn}
                >
                                    {isSigningIn ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="grow"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />
                                            Signing In...
                                        </>
                                    ) : (
                                        <>
                                            Sign In
                                        </>
                                    )}
                                </Button>
                            </Form>
                            
                            <div className="text-center mb-3">
                                <Link 
                                    to="/forgot-password" 
                                    className="text-decoration-none text-muted small"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            
                            <div className="text-center">
                                <p className="modern-text text-muted mb-0">
                                    Don't have an account?{' '}
                                    <Link 
                                        to="/signup" 
                                        className="text-decoration-none fw-medium"
                                        style={{ color: 'var(--accent-primary)' }}
                                    >
                                        Sign up here
                                    </Link>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginForm;