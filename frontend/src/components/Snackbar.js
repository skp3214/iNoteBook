import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faTimes } from '@fortawesome/free-solid-svg-icons';

const Snackbar = ({ show, message, onUndo, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const snackbarContent = (
    <div 
      className="modern-snackbar"
      style={{
        position: 'fixed',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-light)',
        color: 'var(--text-primary)',
        padding: '16px 20px',
        borderRadius: 'var(--border-radius)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        zIndex: 99999,
        boxShadow: 'var(--shadow-xl)',
        animation: 'slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        minWidth: '320px',
        maxWidth: '90vw',
        width: 'fit-content'
      }}
    >
      <div className="d-flex align-items-center gap-2">
        <div 
          style={{
            width: '4px',
            height: '24px',
            borderRadius: '2px',
            background: 'var(--warning)',
            flexShrink: 0
          }}
        />
        <span 
          style={{
            fontSize: '0.9rem',
            fontWeight: '500',
            color: 'var(--text-primary)',
            flex: 1
          }}
        >
          {message}
        </span>
      </div>
      
      <div className="d-flex align-items-center gap-2">
        <button
          onClick={onUndo}
          className="modern-snackbar-btn undo-btn"
          style={{
            background: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'var(--transition)',
            minHeight: '36px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--accent-hover)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--accent-primary)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <FontAwesomeIcon icon={faUndo} style={{ fontSize: '0.8rem' }} />
          UNDO
        </button>
        
        <button
          onClick={onClose}
          className="modern-snackbar-btn close-btn"
          style={{
            background: 'transparent',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-light)',
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition)',
            width: '36px',
            height: '36px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-secondary)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );

  return createPortal(snackbarContent, document.body);
};

export default Snackbar;
