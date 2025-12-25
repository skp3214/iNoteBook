import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Dropdown from 'react-bootstrap/Dropdown';

const DropDownMenu = ({ note, updateNote, handleDeleteClick }) => {
  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        variant="link"
        id={`dropdown-${note._id}`}
        className="p-0 border-0 shadow-none"
        style={{
          color: 'rgba(255, 255, 255, 0.9)',
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
        }}
      >
        <FontAwesomeIcon icon={faEllipsisV} style={{ fontSize: '14px' }} />
      </Dropdown.Toggle>

      <Dropdown.Menu
        className="shadow-lg"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-light)',
          borderRadius: '12px',
          padding: '0.5rem',
        }}
      >
        <Dropdown.Item
          onClick={() => updateNote(note)}
          className="d-flex align-items-center"
          style={{
            borderRadius: '8px',
            padding: '0.625rem 1rem',
            color: 'var(--text-primary)',
            transition: 'all 0.2s ease',
          }}
        >
          <FontAwesomeIcon
            icon={faEdit}
            className="me-2"
            style={{ color: 'var(--accent-primary)', fontSize: '0.9rem' }}
          />
          Edit Note
        </Dropdown.Item>

        <Dropdown.Divider style={{ margin: '0.25rem 0' }} />

        <Dropdown.Item
          onClick={handleDeleteClick}
          className="d-flex align-items-center text-danger"
          style={{
            borderRadius: '8px',
            padding: '0.625rem 1rem',
            transition: 'all 0.2s ease',
          }}
        >
          <FontAwesomeIcon icon={faTrash} className="me-2" style={{ fontSize: '0.9rem' }} />
          Delete Note
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropDownMenu;