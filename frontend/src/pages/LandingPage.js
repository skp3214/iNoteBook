import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBrain, 
  faMicrophone, 
  faTag, 
  faMoon, 
  faWifi, 
  faShield, 
  faSearch, 
  faMobile, 
  faCloud, 
  faRocket,
  faArrowRight,
  faStar,
  faUsers,
  faDownload,
  faPlay
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);
  const token = localStorage.getItem('token');

  // Redirect authenticated users to home page
  useEffect(() => {
    if (token) {
      navigate('/home');
    }
  }, [token, navigate]);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: faBrain,
      title: 'AI Assistant',
      description: 'Chat with your notes using Google Gemini AI. Create and manage notes naturally.',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #10b981 100%)'
    },
    {
      icon: faMicrophone,
      title: 'Voice Recognition',
      description: 'Convert speech to text effortlessly with multi-language support.',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #92400e 0%, #d97706 50%, #f59e0b 100%)'
    },
    {
      icon: faTag,
      title: 'Smart Tags',
      description: 'Organize with color-coded categories and intelligent filtering.',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)'
    },
    {
      icon: faMoon,
      title: 'Dark Mode',
      description: 'Beautiful themes with automatic system preference detection.',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #8b5cf6 100%)'
    },
    {
      icon: faWifi,
      title: 'Offline Ready',
      description: 'Work without internet and sync when connection returns.',
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #0e7490 0%, #0891b2 50%, #06b6d4 100%)'
    },
    {
      icon: faShield,
      title: 'Secure',
      description: 'Advanced encryption and secure authentication system.',
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #ef4444 100%)'
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container fluid className="h-100">
          <Row className="h-100 align-items-center">
            <Col lg={6} className="hero-content">
              <div className="hero-badge">
                <Badge className="modern-badge-ai">
                  <FontAwesomeIcon icon={faBrain} className="me-2" />
                  AI-Powered
                </Badge>
              </div>
              
              <h1 className="hero-title">
                Your <span className="gradient-text">Smart</span><br />
                Note-Taking<br />
                <span className="gradient-text">Assistant</span>
              </h1>
              
              <p className="hero-description">
                Manage your notes with AI assistance, voice recognition, smart organization, 
                and offline support. Capture, organize, and find your ideas effortlessly.
              </p>
              
              <div className="hero-actions">
                <Button 
                  className="hero-btn-primary"
                  onClick={() => navigate('/signup')}
                >
                  <FontAwesomeIcon icon={faRocket} className="me-2" />
                  Get Started Free
                  <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                </Button>
              </div>
            </Col>
            
            <Col lg={6} className="hero-visual">
              <div className="hero-cards-container">
                {/* Sample Note Cards with existing themes */}
                <Card 
                  className="floating-card card-1"
                  style={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
                    border: '2px solid #2563eb'
                  }}
                >
                  <Card.Body>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <Card.Title className="text-white mb-0">Team Meeting</Card.Title>
                    </div>
                    <Card.Text className="text-white opacity-90 mb-3">
                      Discuss project roadmap and sprint planning for Q4 deliverables.
                    </Card.Text>
                    <div className="d-flex align-items-center justify-content-between">
                      <Badge className="modern-badge-work">WORK</Badge>
                      <span className="text-white-50 small">Nov 8, 2025</span>
                    </div>
                  </Card.Body>
                </Card>

                <Card 
                  className="floating-card card-2"
                  style={{
                    background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #ef4444 100%)',
                    border: '2px solid #ef4444'
                  }}
                >
                  <Card.Body>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <Card.Title className="text-white mb-0">Client Presentation</Card.Title>
                    </div>
                    <Card.Text className="text-white opacity-90 mb-3">
                      Prepare slides for the Johnson project proposal tomorrow at 2 PM.
                    </Card.Text>
                    <div className="d-flex align-items-center justify-content-between">
                      <Badge className="modern-badge-urgent">URGENT</Badge>
                      <span className="text-white-50 small">Nov 9, 2025</span>
                    </div>
                  </Card.Body>
                </Card>

                <Card 
                  className="floating-card card-3"
                  style={{
                    background: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #10b981 100%)',
                    border: '2px solid #10b981'
                  }}
                >
                  <Card.Body>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <Card.Title className="text-white mb-0">Grocery Shopping</Card.Title>
                    </div>
                    <Card.Text className="text-white opacity-90 mb-3">
                      Buy organic vegetables, fruits, and dairy products for the week.
                    </Card.Text>
                    <div className="d-flex align-items-center justify-content-between">
                      <Badge className="modern-badge-completed">COMPLETED</Badge>
                      <span className="text-white-50 small">Nov 7, 2025</span>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
        
        {/* Animated background */}
        <div className="hero-background">
          <div className="floating-shapes">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`shape shape-${i + 1}`}></div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title">
                Everything You Need for <span className="gradient-text">Smart Notes</span>
              </h2>
              <p className="section-description">
                Powerful features to boost your productivity
              </p>
            </Col>
          </Row>

          <Row className="features-grid">
            {features.map((feature, index) => (
              <Col lg={4} md={6} key={index} className="mb-4">
                <Card 
                  className={`feature-card ${currentFeature === index ? 'active' : ''}`}
                  onMouseEnter={() => setCurrentFeature(index)}
                >
                  <Card.Body className="text-center p-4">
                    <div 
                      className="feature-icon"
                      style={{ 
                        background: feature.gradient,
                        color: 'white'
                      }}
                    >
                      <FontAwesomeIcon icon={feature.icon} />
                    </div>
                    
                    <h4 className="feature-title">{feature.title}</h4>
                    <p className="feature-description">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;