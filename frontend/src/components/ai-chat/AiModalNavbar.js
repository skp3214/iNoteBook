import { faGear, faRobot, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Button, Modal } from 'react-bootstrap';

const AiModalNavbar = ({handleOpenConfig,setShowModal}) => {
  return (
        <Modal.Header
          closeButton={false}
          style={{
            background: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border-light)',
            padding: '1rem 1.5rem'
          }}
        >
          <Modal.Title className="d-flex align-items-center justify-content-between w-100">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: '30px',
                  height: '30px',
                  background: 'linear-gradient(135deg, #000000 0%, #444444 100%)',
                  fontSize: '1.25rem',
                }}
              >
                <FontAwesomeIcon
                icon={faRobot}
                style={{
                  fontSize: '14px',
                  cursor: 'pointer',
                  color:'white'
                }} />
              </div>
              <span
              style={
                {
                  fontSize:'14px'
                }
              }
              >AI Assistant</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="link"
                onClick={handleOpenConfig}
                className="p-0"
                style={{
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  fontSize: '1.25rem',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Configure AI"
              >
                <FontAwesomeIcon
                icon={faGear}
                style={{
                  fontSize: '14px',
                  cursor: 'pointer',
                  color:'var(--text-primary)'
                }} />
              </Button>
              <Button
                variant="link"
                onClick={() => {
                  // Clear chat functionality will be passed to AiChat
                  if (window.clearAiChat) window.clearAiChat();
                }}
                className="p-0"
                style={{
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  fontSize: '1.25rem',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Clear Chat"
              >
                <FontAwesomeIcon
                icon={faTrash}
                style={{
                  fontSize: '14px',
                  cursor: 'pointer',
                  color:'red'
                }} />
              </Button>
              <Button
                variant="link"
                onClick={() => setShowModal(false)}
                className="p-0"
                style={{
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  fontSize: '1.25rem',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Close"
              >
                <FontAwesomeIcon
                icon={faXmark}
                style={{
                  fontSize: '14px',
                  cursor: 'pointer',
                  color:'var(--text-primary)'
                }} />
              </Button>
            </div>
          </Modal.Title>
        </Modal.Header>
  )
}

export default AiModalNavbar