import { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Dropdown from 'react-bootstrap/Dropdown';
import noteContext from '../context/notes/noteContext';

const NotesItem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note, updateNote } = props;

  const handleDeleteClick = () => {
    console.log('Deleting note with ID:', note._id);
    deleteNote(note._id);
  };

  const tagLabelMap = {
    Work: 'primary',
    Urgent: 'danger',
    Completed: 'success',
    Important: 'warning',
    Personal: 'info',
  };
  
  const badgeVariant = tagLabelMap[note.tag] || 'secondary';
  const tagLabel = note.tag || 'No Tag';

  return (
    <Card className="modern-card fade-in note-card-mobile" style={{ width: '320px', minHeight: '200px' }}>
      <Card.Header className="border-0 pb-2 d-flex justify-content-between align-items-center bg-transparent">
        <div className="d-flex gap-2 align-items-center">
          {note.tag && tagLabel !== 'No Tag' && (
            <Badge
              bg={badgeVariant}
              className="px-2 py-1"
              style={{ 
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {tagLabel}
            </Badge>
          )}
          {note.isOffline && (
            <Badge bg="secondary" className="px-2 py-1" style={{ fontSize: '0.7rem' }}>
              Offline
            </Badge>
          )}
        </div>
        
        {/* Three-dot dropdown menu */}
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="link"
            id={`dropdown-${note._id}`}
            className="p-0 border-0 shadow-none modern-dropdown-toggle"
            style={{
              color: 'var(--text-muted)',
              background: 'transparent'
            }}
          >
            <FontAwesomeIcon
              icon={faEllipsisV}
              style={{
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            />
          </Dropdown.Toggle>

          <Dropdown.Menu className="modern-dropdown-menu shadow-lg">
            <Dropdown.Item
              onClick={() => updateNote(note)}
              className="modern-dropdown-item d-flex align-items-center"
            >
              <FontAwesomeIcon
                icon={faEdit}
                className="me-2"
                style={{ color: 'var(--accent-primary)', fontSize: '0.9rem' }}
              />
              Edit Note
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={handleDeleteClick}
              className="modern-dropdown-item d-flex align-items-center text-danger"
            >
              <FontAwesomeIcon
                icon={faTrash}
                className="me-2"
                style={{ fontSize: '0.9rem' }}
              />
              Delete Note
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Card.Header>
      
      <Card.Body className="pt-0">
        <Card.Title className="modern-title h5 mb-3" style={{ 
          fontWeight: 600,
          lineHeight: 1.3,
          color: 'var(--text-primary)'
        }}>
          {note.title}
        </Card.Title>
        <Card.Text className="modern-text" style={{ 
          minHeight: '60px',
          color: 'var(--text-secondary)',
          fontSize: '0.95rem',
          lineHeight: 1.6
        }}>
          {note.description}
        </Card.Text>
      </Card.Body>
      
      <Card.Footer className="border-0 pt-0 d-flex justify-content-between align-items-center bg-transparent">
        <div className="d-flex gap-2">
          <small className="text-muted" style={{ fontSize: '0.75rem' }}>
            {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Today'}
          </small>
        </div>
        
        {note.isOffline && (
          <small className="text-warning" style={{ fontSize: '0.7rem', fontWeight: '500' }}>
            Syncing...
          </small>
        )}
      </Card.Footer>
    </Card>
  );
};

export default NotesItem;