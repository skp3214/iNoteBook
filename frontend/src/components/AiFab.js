import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Modal, Button } from 'react-bootstrap';
import AiChat from './AiChat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import AiConfigModal from './ai-chat/AiConfigModal';
import AiModalNavbar from './ai-chat/AiModalNavbar';

const AiFab = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [saveLocally, setSaveLocally] = useState(true);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleSaveConfig = () => {
    if (apiKey.trim()) {
      if (saveLocally) {
        localStorage.setItem('gemini_api_key', apiKey);
      }
      setShowConfig(false);
      setShowModal(true);
    }
  };

  const handleOpenConfig = () => {
    setShowModal(false);
    setShowConfig(true);
  };

  // FAB button rendered via Portal to document.body for true fixed positioning
  const fabButton = (
    <Button
      onClick={handleOpenModal}
      className="rounded-circle border-0 shadow-lg d-flex align-items-center justify-content-center ai-fab"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '64px',
        height: '64px',
        background: 'linear-gradient(135deg, #000000 0%, #444444 100%)',
        fontSize: '1.5rem',
        color: 'white',
        zIndex: 99999,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
      }}
    >
      <FontAwesomeIcon
        icon={faRobot}
        style={{
          fontSize: '24px',
          cursor: 'pointer',
          pointerEvents: 'none'
        }}
      />
    </Button>
  );

  return (
    <>
      {createPortal(fabButton, document.body)}

      <AiConfigModal
        setShowConfig={setShowConfig}
        showConfig={showConfig}
        apiKey={apiKey}
        saveLocally={saveLocally}
        setSaveLocally={setSaveLocally}
        setApiKey={setApiKey}
        handleSaveConfig={handleSaveConfig}
      />

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="xl"
        className="modern-modal ai-assistant-modal"
        style={{ zIndex: 1055 }}
        dialogClassName="modal-80w"
      >
        <AiModalNavbar
          handleOpenConfig={handleOpenConfig}
          setShowModal={setShowModal}
        />
        <Modal.Body
          style={{
            background: 'var(--bg-primary)',
            padding: 0,
            height: 'calc(80vh - 80px)',
            maxHeight: '700px',
            minHeight: '500px'
          }}
        >
          <AiChat />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AiFab;
