import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Button, Modal } from 'react-bootstrap'

const SpeechModal = ({ showSpeechModal, handleModalClose, speechTranscript, stopListening,
    isListening, interimTranscript
}) => {
    return (
        <>
            <Modal
                show={showSpeechModal}
                onHide={handleModalClose}
                centered
                backdrop="static"
                className="modern-modal"
            >
                <Modal.Header closeButton style={{
                    background: 'var(--bg-secondary)',
                    borderBottom: '1px solid var(--border-light)'
                }}>
                    <Modal.Title className="d-flex align-items-center">
                        <FontAwesomeIcon
                            icon={faMicrophone}
                            className={`me-2 ${isListening ? 'animate-pulse' : ''}`}
                            style={{
                                color: isListening ? 'var(--danger)' : 'var(--accent-primary)',
                                fontSize: '1.25rem'
                            }}
                        />
                        {isListening ? 'Listening...' : 'Speech Recognition'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{
                    background: 'var(--bg-primary)',
                    minHeight: '200px',
                    padding: '2rem'
                }}>
                    <div className="text-center mb-3">
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.9rem'
                        }}>
                            {isListening
                                ? 'Speak clearly into your microphone...'
                                : speechTranscript
                                    ? 'Processing your speech...'
                                    : 'Getting ready to listen...'}
                        </p>
                    </div>

                    <div style={{
                        background: 'var(--bg-secondary)',
                        border: '2px solid var(--border-light)',
                        borderRadius: 'var(--border-radius)',
                        padding: '1.5rem',
                        minHeight: '120px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        color: 'var(--text-primary)',
                        position: 'relative'
                    }}>
                        {speechTranscript && (
                            <div>
                                <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                                    {speechTranscript}
                                </span>
                                {!isListening && (
                                    <div style={{
                                        marginTop: '1rem',
                                        padding: '0.5rem',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        color: 'var(--accent-primary)',
                                        textAlign: 'center'
                                    }}>
                                        Sending message automatically...
                                    </div>
                                )}
                            </div>
                        )}
                        {interimTranscript && (
                            <span style={{
                                color: 'var(--text-muted)',
                                fontStyle: 'italic'
                            }}>
                                {interimTranscript}
                            </span>
                        )}
                        {!speechTranscript && !interimTranscript && (
                            <span style={{
                                color: 'var(--text-muted)',
                                fontStyle: 'italic'
                            }}>
                                Your speech will appear here...
                            </span>
                        )}
                    </div>

                    {isListening && (
                        <div className="text-center mt-3">
                            <Button
                                variant="danger"
                                onClick={stopListening}
                                className="modern-btn"
                                style={{
                                    borderRadius: '25px',
                                    padding: '0.75rem 1.5rem',
                                    fontWeight: '600'
                                }}
                            >
                                <FontAwesomeIcon icon={faMicrophoneSlash} className="me-2" />
                                Stop Listening
                            </Button>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </>
    )
}

export default SpeechModal