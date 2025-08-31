import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';

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
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          {userExistAlert && (
            <div className="alert alert-danger" role="alert">
              {alertdata}
            </div>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={onChange}
                className="theme-input"
                required
              />
            </Form.Group>

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
              />
            </Form.Group>

            <Button variant="primary" className="my-3" type="submit" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  SigningUp...
                </>
              ) : 'Sign Up'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpForm;
