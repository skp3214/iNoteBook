import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        password: '',
        email: '',
    });
    const [isSigningIn, setisSigningIn] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const history = useNavigate();

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
                history('/');
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
        <Container>
            <Row className="justify-content-center mt-5">
                <Col md={6}>
                    {showAlert && (
                        <div className="alert alert-danger" role="alert">
                            Login failed. Please enter the correct email and password.
                        </div>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={onChange}
                                className="theme-input"
                                required
                                disabled={isSigningIn}
                            />
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={onChange}
                                className="theme-input"
                                required
                                disabled={isSigningIn}
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            className="my-3"
                            type="submit"
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
                                    />{' '}
                                    SigningIn...
                                </>
                            ) : 'Login'}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginForm;
