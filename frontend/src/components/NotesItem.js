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

  const tagColorMap = {
    Work: {
      borderColor: '#3b82f6',
      badgeVariant: 'primary',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)'
    },
    Urgent: {
      borderColor: '#ef4444',
      badgeVariant: 'danger',
      gradient: 'linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #ef4444 100%)'
    },
    Completed: {
      borderColor: '#10b981',
      badgeVariant: 'success',
      gradient: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #10b981 100%)'
    },
    Important: {
      borderColor: '#f59e0b',
      badgeVariant: 'warning',
      gradient: 'linear-gradient(135deg, #92400e 0%, #d97706 50%, #f59e0b 100%)'
    },
    Personal: {
      borderColor: '#06b6d4',
      badgeVariant: 'info',
      gradient: 'linear-gradient(135deg, #0e7490 0%, #0891b2 50%, #06b6d4 100%)'
    },
  };
  
  const tagInfo = tagColorMap[note.tag] || {
    borderColor: '#6b7280',
    badgeVariant: 'secondary',
    gradient: 'linear-gradient(135deg, #374151 0%, #4b5563 50%, #6b7280 100%)'
  };
  
  const tagLabel = note.tag || 'No Tag';

  return (
    <div className="gradient-card-container">
      <Card 
        className="gradient-note-card"
        style={{ 
          background: tagInfo.gradient,
          border: `2px solid ${tagInfo.borderColor}`,
          borderRadius: '16px',
          width: '100%',
          maxWidth: '320px',
          minHeight: '200px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Card.Body className="d-flex flex-column justify-content-between h-100 p-4" style={{ paddingTop: '24px' }}>
          <div>
            <Card.Title 
              className="text-white mb-3" 
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '1.25rem',
                lineHeight: 1.3
              }}
            >
              {note.title}
            </Card.Title>
            <Card.Text 
              className="text-white mb-4" 
              style={{ 
                opacity: 0.9,
                fontSize: '0.95rem',
                lineHeight: 1.6,
                minHeight: '60px'
              }}
            >
              {note.description}
            </Card.Text>
          </div>
          
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <div className="d-flex align-items-center gap-2">
              {note.tag && tagLabel !== 'No Tag' && (
                <Badge
                  bg={tagInfo.badgeVariant}
                  className="px-2 py-1"
                  style={{ 
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  {tagLabel}
                </Badge>
              )}
              {note.isOffline && (
                <Badge 
                  className="px-2 py-1" 
                  style={{ 
                    fontSize: '0.65rem',
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: '#fbbf24',
                    border: '1px solid rgba(245, 158, 11, 0.3)'
                  }}
                >
                  Offline
                </Badge>
              )}
            </div>
            
            {/* Three-dot dropdown menu moved to bottom-right */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                id={`dropdown-${note._id}`}
                className="p-0 border-0 shadow-none gradient-dropdown-toggle-footer"
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <FontAwesomeIcon
                  icon={faEllipsisV}
                  style={{
                    fontSize: '12px',
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
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NotesItem;