import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Spinner, Card } from 'react-bootstrap';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [userExistAlert, setuserExistAlert] = useState(false);
  const [alertdata, setalertdata] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

  let history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSigningUp(true);

    const { name, email, password } = formData;
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const response = await fetch(`${apiBaseUrl}/api/auth/createuser`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password })
    });

    const json = await response.json();

    if (json.userExist) {
      setalertdata(`User with ${formData.email} already exists.`);
      setuserExistAlert(true);
      removeAlert();
      setIsSigningUp(false);
    } else {
      setuserExistAlert(false);
      history('/');
    }
  };

  const removeAlert = () => {
    setTimeout(() => {
      setuserExistAlert(false);
    }, 3000);
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
                <div 
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '64px',
                    height: '64px',
                    background: 'var(--accent-secondary)',
                    borderRadius: '16px',
                    fontSize: '2rem'
                  }}
                >
                  ✨
                </div>
                <h3 className="modern-title mb-2">Create Account</h3>
                <p className="modern-text text-muted">
                  Join iNoteBook to start organizing your thoughts
                </p>
              </div>

              {userExistAlert && (
                <div className="modern-alert alert-danger mb-4">
                  <strong>Account exists:</strong> {alertdata}
                </div>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label className="modern-text fw-medium mb-2">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={onChange}
                    className="modern-input"
                    required
                    disabled={isSigningUp}
                  />
                </Form.Group>

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
                    disabled={isSigningUp}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label className="modern-text fw-medium mb-2">Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={onChange}
                    className="modern-input"
                    required
                    disabled={isSigningUp}
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  className="modern-btn modern-btn-solid w-100 py-3 mb-4" 
                  disabled={isSigningUp}
                >
                  {isSigningUp ? (
                    <>
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <span className="me-2">🎉</span>
                      Create Account
                    </>
                  )}
                </Button>
              </Form>
              
              <div className="text-center">
                <p className="modern-text text-muted mb-0">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-decoration-none fw-medium"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    Sign in here
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

export default SignUpForm;