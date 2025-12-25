import { faGear, faRobot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Modal } from 'react-bootstrap';import React from 'react'
import { Form } from 'react-bootstrap';

const AiConfigModal = ({setShowConfig, showConfig,apiKey,saveLocally,setSaveLocally, setApiKey,handleSaveConfig}) => {
    return (
        <>
            {/* AI Configuration Modal */}
            <Modal
                show={showConfig}
                onHide={() => setShowConfig(false)}
                centered
                className="modern-modal ai-config-modal"
            >
                <Modal.Header closeButton style={{ background: 'var(--bg-primary)', borderBottom: 'none', paddingBottom: '1rem' }}>
                    <Modal.Title className="d-flex align-items-center gap-3">
                        <div
                            className="d-flex align-items-center justify-content-center rounded-circle"
                            style={{
                                width: '28px',
                                height: '28px',
                                background: 'linear-gradient(135deg, #000000 0%, #444444 100%)',
                                fontSize: '1.5rem',
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faRobot}
                                style={{
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    color: 'white'
                                }} />
                        </div>
                        <span style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>AI Configuration</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: 'var(--bg-primary)' }}>
                    {/* Info Banner */}
                    <div
                        className="p-3 mb-4 rounded-3 d-flex align-items-start gap-3"
                        style={{
                            background: 'rgba(245, 158, 11, 0.1)',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                        }}
                    >
                        <div style={{ fontSize: '1.5rem' }}>
                            <FontAwesomeIcon
                                icon={faGear}
                                style={{
                                    fontSize: '24px',
                                    cursor: 'pointer'
                                }} />
                        </div>
                        <div>
                            <h6 className="mb-1" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                                Custom API Key (Optional)
                            </h6>
                            <p className="mb-0" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                By default, AI uses our company API key. If it expires or you want to use your own Gemini API key, configure it here. Your key is stored locally and never shared.
                            </p>
                        </div>
                    </div>

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                                Gemini API Key
                            </Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your Gemini API key"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="modern-input"
                                style={{
                                    padding: '0.875rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '12px',
                                }}
                            />
                            <Form.Text style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                Get your API key from{' '}
                                <a
                                    href="https://aistudio.google.com/app/apikey"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}
                                >
                                    Google AI Studio →
                                </a>
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                id="save-api-key"
                                label="Save API key locally for future sessions"
                                checked={saveLocally}
                                onChange={(e) => setSaveLocally(e.target.checked)}
                                style={{ color: 'var(--text-secondary)' }}
                            />
                        </Form.Group>

                        {localStorage.getItem('gemini_api_key') && (
                            <div className="mb-3">
                                <Button
                                    variant="outline-warning"
                                    size="sm"
                                    onClick={() => {
                                        localStorage.removeItem('gemini_api_key');
                                        setApiKey('');
                                    }}
                                    style={{
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                    }}
                                >
                                    🔄 Use Company API Key (Remove Custom Key)
                                </Button>
                            </div>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{ background: 'var(--bg-primary)', borderTop: 'none', paddingTop: 0 }}>
                    <Button
                        variant="outline-secondary"
                        onClick={() => setShowConfig(false)}
                        className="modern-btn modern-btn-outline"
                        style={{
                            borderRadius: '12px',
                            padding: '0.75rem 1.5rem',
                            fontWeight: 600,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveConfig}
                        disabled={!apiKey.trim()}
                        className="modern-btn"
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.75rem 1.5rem',
                            fontWeight: 600,
                            color: 'white',
                        }}
                    >
                        Save Custom API Key
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AiConfigModal