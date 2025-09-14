import { useContext, useEffect, useState } from 'react';
import NotesItem from './NotesItem';
import noteContext from '../context/notes/noteContext';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import ModalForm from './ModalForm';
import Snackbar from './Snackbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const Notes = () => {
  const context = useContext(noteContext);
  const navigate = useNavigate();
  const { note, getNotes, editNote, addNote, isOnline} = context;

  const [notes, setNote] = useState({
    id: '',
    etitle: '',
    edescription: '',
    etag: '',
    title: '',
    description: '',
    tag: ''
  });
  const [localNotes, setLocalNotes] = useState([]);
  const [filterTag, setFilterTag] = useState('');
  const [sortAlpha, setSortAlpha] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalError, setModalError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ show: false, note: null, deleteAction: null, timeoutId: null });

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getNotes();
    } else {
      navigate('/login');
    }
  }, [getNotes, navigate]);

  // Sync local notes with context notes
  useEffect(() => {
    setLocalNotes(note);
  }, [note]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (snackbar.timeoutId) {
        clearTimeout(snackbar.timeoutId);
      }
    };
  }, [snackbar.timeoutId]);

  let filteredNotes = localNotes;

  if (searchQuery) {
    filteredNotes = filteredNotes.filter(n =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filterTag) {
    filteredNotes = filteredNotes.filter(n => n.tag === filterTag);
  }

  filteredNotes = [...filteredNotes].sort((a, b) =>
    sortAlpha ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
  );

  const updateNote = (currentNote) => {
    setIsEditMode(true);
    setShowModal(true);
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
      title: '',
      description: '',
      tag: ''
    });
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setShowModal(true);
    setNote({
      id: '',
      etitle: '',
      edescription: '',
      etag: '',
      title: '',
      description: '',
      tag: ''
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalError('');
    setIsEditMode(false);
    setNote({
      id: '',
      etitle: '',
      edescription: '',
      etag: '',
      title: '',
      description: '',
      tag: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditMode) {
      if (!notes.etitle || notes.etitle.trim().length < 2) {
        setModalError('Title must be at least 2 characters long');
        return;
      }
      if (!notes.edescription || notes.edescription.trim().length < 2) {
        setModalError('Description must be at least 2 characters long');
        return;
      }
      if (!notes.etag) {
        setModalError('Please select a tag');
        return;
      }

      handleModalClose();
      editNote(notes.id, notes.etitle.trim(), notes.edescription.trim(), notes.etag);
    } else {
      if (!notes.title || notes.title.trim().length < 2) {
        setModalError('Title must be at least 2 characters long');
        return;
      }
      if (!notes.description || notes.description.trim().length < 2) {
        setModalError('Description must be at least 2 characters long');
        return;
      }
      if (!notes.tag) {
        setModalError('Please select a tag');
        return;
      }

      handleModalClose();
      addNote(notes.title.trim(), notes.description.trim(), notes.tag);
    }
  };

  const handleShowSnackbar = (noteToDelete, deleteAction) => {
    // Clear any existing timeout
    if (snackbar.timeoutId) {
      clearTimeout(snackbar.timeoutId);
    }
    
    // Immediately remove note from UI for visual feedback
    setLocalNotes(prevNotes => prevNotes.filter(n => n._id !== noteToDelete._id));
    
    // Set timeout to execute actual deletion after 8 seconds
    const timeoutId = setTimeout(() => {
      deleteAction();
      setSnackbar({ show: false, note: null, deleteAction: null, timeoutId: null });
    }, 8000);
    
    setSnackbar({ show: true, note: noteToDelete, deleteAction, timeoutId });
  };

  const handleUndoDelete = () => {
    // Clear the timeout to prevent deletion
    if (snackbar.timeoutId) {
      clearTimeout(snackbar.timeoutId);
    }
    
    // Restore the note to local display immediately
    if (snackbar.note) {
      setLocalNotes(prevNotes => [...prevNotes, snackbar.note]);
    }
    
    // Close the snackbar
    setSnackbar({ show: false, note: null, deleteAction: null, timeoutId: null });
  };

  const handleCloseSnackbar = () => {
    // Clear timeout when manually closing
    if (snackbar.timeoutId) {
      clearTimeout(snackbar.timeoutId);
    }
    setSnackbar({ show: false, note: null, deleteAction: null, timeoutId: null });
  };

  const uniqueTags = [
    { Urgent: 'danger' },
    { Completed: 'success' },
    { Important: 'warning' },
    { Personal: 'info' },
  ];

  return (
    <Container fluid className="px-4 py-3">
      <Row>
        <Col lg={10} xl={8} className="mx-auto">
          
          <ModalForm
            show={showModal}
            onClose={handleModalClose}
            onSubmit={handleSubmit}
            modalError={modalError}
            noteData={notes}
            onChange={(e) => setNote({ ...notes, [e.target.name]: e.target.value })}
            isEditMode={isEditMode}
          />
          
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-5">
            <div>
              <h1 className="fw-bold mb-1" style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '2.5rem'
              }}>
                Your Notes
              </h1>
              <p className="text-muted mb-0">Organize your thoughts beautifully</p>
            </div>
            <div className={`px-3 py-2 rounded-pill fw-medium ${isOnline ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
              <i className={`fas ${isOnline ? 'fa-wifi' : 'fa-wifi-slash'} me-2`}></i>
              {isOnline ? 'Online' : 'Offline'}
            </div>
          </div>

          {!isOnline && (
            <div className="alert alert-warning border-0 rounded-4 mb-4" style={{
              background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)'
            }}>
              <i className="fas fa-exclamation-triangle me-2"></i>
              <strong>Offline Mode:</strong> Changes will sync when you're back online
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-4">
            <div className="position-relative">
              <i className="fas fa-search position-absolute" style={{
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d',
                zIndex: 5
              }}></i>
              <Form.Control
                type="text"
                placeholder="Search your notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-5 py-3 border-0 rounded-4 shadow-sm search-input"
                style={{
                  fontSize: '1.1rem'
                }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
            <div className="dropdown position-relative">
              <button 
                className="btn btn-outline-primary dropdown-toggle rounded-pill px-4 py-2 fw-medium d-flex align-items-center gap-2 shadow-sm"
                type="button" 
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  background: 'rgba(102, 126, 234, 0.1)',
                  border: '2px solid rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-filter"></i>
                <span>{filterTag || 'All Notess'}</span>
                <span className="badge bg-primary rounded-pill ms-1">
                  {filterTag ? localNotes.filter(n => n.tag === filterTag).length : localNotes.length}
                </span>
              </button>
              {showDropdown && (
                <ul className="dropdown-menu show position-absolute shadow-lg border-0 rounded-4 p-2" style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  minWidth: '250px',
                  top: '100%',
                  left: '0',
                  zIndex: 1000
                }}>
                  <li>
                    <button 
                      className={`dropdown-item rounded-3 py-2 px-3 fw-medium d-flex align-items-center justify-content-between ${filterTag === '' ? 'active' : ''}`}
                      onClick={() => {
                        setFilterTag('');
                        setShowDropdown(false);
                      }}
                      style={{ transition: 'all 0.2s ease' }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <i className="fas fa-th-large text-secondary"></i>
                        <span>All Notes</span>
                      </div>
                      <span className="badge bg-secondary rounded-pill">{localNotes.length}</span>
                    </button>
                  </li>
                  <li><hr className="dropdown-divider my-2" /></li>
                  {uniqueTags.map(item => {
                    const tagName = Object.keys(item)[0];
                    const count = localNotes.filter(n => n.tag === tagName).length;
                    const tagIcons = {
                      Work: 'fa-briefcase',
                      Urgent: 'fa-exclamation-triangle',
                      Completed: 'fa-check-circle',
                      Important: 'fa-star',
                      Personal: 'fa-user'
                    };
                    const tagColors = {
                      Work: 'primary',
                      Urgent: 'danger', 
                      Completed: 'success',
                      Important: 'warning',
                      Personal: 'info'
                    };
                    const icon = tagIcons[tagName] || 'fa-tag';
                    const color = tagColors[tagName] || 'secondary';
                    return (
                      <li key={tagName}>
                        <button
                          className={`dropdown-item rounded-3 py-2 px-3 fw-medium d-flex align-items-center justify-content-between ${filterTag === tagName ? 'active' : ''}`}
                          onClick={() => {
                            setFilterTag(tagName);
                            setShowDropdown(false);
                          }}
                          style={{ transition: 'all 0.2s ease' }}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <i className={`fas ${icon} text-${color}`}></i>
                            <span>{tagName}</span>
                          </div>
                          <span className={`badge bg-${color} rounded-pill`}>{count}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            
            <button 
              className="btn btn-outline-light rounded-pill px-4 py-2 fw-medium d-flex align-items-center gap-2 shadow-sm sort-btn"
              onClick={() => setSortAlpha(a => !a)}
              style={{ 
                transition: 'all 0.3s ease'
              }}
            >
              <i className={`fas fa-sort-alpha-${sortAlpha ? 'down' : 'up'}`}></i>
              <span className="d-none d-sm-inline">Sort {sortAlpha ? 'A-Z' : 'Z-A'}</span>
              <span className="d-sm-none">{sortAlpha ? 'A-Z' : 'Z-A'}</span>
            </button>
          </div>

          {/* Results Count */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <p className="text-muted mb-0 fw-medium">
              <i className="fas fa-sticky-note me-2"></i>
              {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
            </p>
            {(searchQuery || filterTag) && (
              <button 
                className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                onClick={() => {
                  setSearchQuery('');
                  setFilterTag('');
                }}
              >
                <i className="fas fa-times me-1"></i>Clear filters
              </button>
            )}
          </div>

          {/* Notes Content */}
          <div className="position-relative" style={{ minHeight: '200px' }}>
            {filteredNotes.length === 0 && (
              <div className="text-center py-5">
                <div className="mb-3" style={{ fontSize: '3rem', opacity: 0.3 }}>📝</div>
                <h5 className="modern-title text-muted">No Notes Found</h5>
                <p className="modern-text text-muted">
                  {searchQuery || filterTag ? 'Try adjusting your search or filter' : 'Create your first note to get started'}
                </p>
              </div>
            )}
            
            {filteredNotes.length > 0 && (
              <div className="modern-grid">
                {filteredNotes.map((n, idx) => (
                  <div key={n._id || idx} className="fade-in">
                    <NotesItem note={n} updateNote={updateNote} onShowSnackbar={handleShowSnackbar} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* Floating Add Button */}
      <Button
        onClick={openAddModal}
        className="position-fixed rounded-circle border-0 shadow-lg d-flex align-items-center justify-content-center"
        style={{
          bottom: '2rem',
          right: '2rem',
          width: '70px',
          height: '70px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontSize: '1.8rem',
          color: 'white',
          zIndex: 1000,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
          fontWeight: 'bold'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.15)';
          e.target.style.boxShadow = '0 16px 48px rgba(102, 126, 234, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.4)';
        }}
      >
        ✏️
      </Button>

      {/* Snackbar */}
      <Snackbar
        show={snackbar.show}
        message={`"${snackbar.note?.title}" deleted`}
        onUndo={handleUndoDelete}
        onClose={handleCloseSnackbar}
      />
    </Container>
  );
};

export default Notes;
