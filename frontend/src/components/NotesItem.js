import { useContext, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Dropdown from 'react-bootstrap/Dropdown';
import noteContext from '../context/notes/noteContext';

const NotesItem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note, updateNote, onShowSnackbar, viewMode } = props;

  const [swipeX, setSwipeX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  const handleDeleteClick = () => {
    deleteNote(note._id);
  };

  const handleSwipeDelete = () => {
    if (onShowSnackbar) {
      // Pass the full note object and the delete function
      onShowSnackbar(note, () => deleteNote(note._id));
    } else {
      deleteNote(note._id);
    }
  };

  const handleTouchStart = (e) => {
    if (window.innerWidth > 768) return; // Only on mobile
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || window.innerWidth > 768) return;
    currentX.current = e.touches[0].clientX;
    const diffX = currentX.current - startX.current;
    if (diffX < 0) { // Only allow left swipe
      setSwipeX(Math.max(diffX, -100));
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || window.innerWidth > 768) return;
    setIsDragging(false);

    if (swipeX < -60) { // Threshold for delete
      handleSwipeDelete();
    }
    setSwipeX(0);
  };

  const tagColorMap = {
    Work: {
      borderColor: '#2563eb',
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

  // List view layout
  if (viewMode === 'list') {
    return (
      <Card
        className="list-note-card"
        style={{
          background: tagInfo.gradient,
          border: `2px solid ${tagInfo.borderColor}`,
          borderRadius: '20px',
          width: '100%',
          position: 'relative',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: isDropdownOpen ? 1050 : 1,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.25)';
          e.currentTarget.style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <Card.Body className="d-flex align-items-center p-4">
          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="d-flex align-items-start justify-content-between mb-2">
              <Card.Title
                className="mb-2 text-white"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  flex: 1,
                }}
              >
                {note.title}
              </Card.Title>
            </div>

            <Card.Text
              className="mb-3 text-white"
              style={{
                opacity: 0.95,
                fontSize: '0.95rem',
                lineHeight: 1.6,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {note.description}
            </Card.Text>

            <div className="d-flex align-items-center gap-3">
              {note.tag && tagLabel !== 'No Tag' && (
                <Badge
                  bg={tagInfo.badgeVariant}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    padding: '0.35rem 0.75rem',
                    background: 'rgba(255, 255, 255, 0.25)',
                    color: 'white',
                    border: `1px solid ${tagInfo.borderColor}`,
                    borderRadius: '8px',
                  }}
                >
                  {tagLabel.toUpperCase()}
                </Badge>
              )}
              {note.date && (
                <span
                  className="text-white"
                  style={{
                    fontSize: '0.75rem',
                    opacity: 0.8,
                  }}
                >
                  {new Date(note.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>

          {/* Right: Dropdown Menu */}
          <Dropdown 
            align="end" 
            className="ms-3" 
            style={{ position: 'static', zIndex: 1060 }}
            onToggle={(isOpen) => setIsDropdownOpen(isOpen)}
          >
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
                flexShrink: 0,
                position: 'relative',
                zIndex: 1061,
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              <FontAwesomeIcon
                icon={faEllipsisV}
                style={{
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              />
            </Dropdown.Toggle>

            <Dropdown.Menu className="modern-dropdown-menu shadow-lg" style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-light)',
              borderRadius: '12px',
              padding: '0.5rem',
              zIndex: 1070,
              position: 'absolute',
              top: '100%',
              right: 0,
            }}>
              <Dropdown.Item
                onClick={() => updateNote(note)}
                className="modern-dropdown-item d-flex align-items-center"
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
                className="modern-dropdown-item d-flex align-items-center text-danger"
                style={{
                  borderRadius: '8px',
                  padding: '0.625rem 1rem',
                  transition: 'all 0.2s ease',
                }}
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
        </Card.Body>
      </Card>
    );
  }

  // Grid view layout (original)
  return (
    <div className="gradient-card-container" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Delete background */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '80px',
          background: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '16px',
          opacity: Math.abs(swipeX) / 100
        }}
      >
        <FontAwesomeIcon icon={faTrash} style={{ color: 'white', fontSize: '1.2rem' }} />
      </div>

      <Card
        className="gradient-note-card"
        style={{
          background: tagInfo.gradient,
          border: `2px solid ${tagInfo.borderColor}`,
          borderRadius: '20px',
          width: '100%',
          minHeight: '220px',
          position: 'relative',
          overflow: 'hidden',
          transform: `translateX(${swipeX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Card.Body className="d-flex flex-column justify-content-between h-100 p-4">
          <div>
            <Card.Title
              className="text-white mb-3"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '1.35rem',
                lineHeight: 1.3,
              }}
            >
              {note.title}
            </Card.Title>
            <Card.Text
              className="text-white mb-4"
              style={{
                opacity: 0.95,
                fontSize: '0.95rem',
                lineHeight: 1.7,
                minHeight: '60px',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
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
                  className="px-3 py-1"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    textTransform: 'capitalize',
                    letterSpacing: '0.3px',
                    background: 'rgba(255, 255, 255, 0.25)',
                    color: 'white',
                    border: `1px solid ${tagInfo.borderColor}`,
                    borderRadius: '6px',
                  }}
                >
                  {tagLabel.toUpperCase()}
                </Badge>
              )}
              {note.date && (
                <span
                  className="text-white"
                  style={{
                    fontSize: '0.75rem',
                    opacity: 0.8,
                  }}
                >
                  {new Date(note.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year:'numeric' })}
                </span>
              )}
            </div>

            {/* Three-dot dropdown menu moved to bottom-right */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                id={`dropdown-${note._id}`}
                className="p-0 border-0 shadow-none gradient-dropdown-toggle-footer"
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
                  transition: 'all 0.3s ease'
                }}
              >
                <FontAwesomeIcon
                  icon={faEllipsisV}
                  style={{
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu className="modern-dropdown-menu shadow-lg" style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '0.5rem',
              }}>
                <Dropdown.Item
                  onClick={() => updateNote(note)}
                  className="modern-dropdown-item d-flex align-items-center"
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
                  className="modern-dropdown-item d-flex align-items-center text-danger"
                  style={{
                    borderRadius: '8px',
                    padding: '0.625rem 1rem',
                    transition: 'all 0.2s ease',
                  }}
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
