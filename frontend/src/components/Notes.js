import { useContext, useEffect, useState } from 'react';
import NotesItem from './NotesItem';
import noteContext from '../context/notes/noteContext';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import ModalForm from './ModalForm';
import Snackbar from './Snackbar';
import Sidebar from './Sidebar';
import AiFab from './AiFab';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const Notes = ({ searchQuery: externalSearchQuery, setSearchQuery: externalSetSearchQuery }) => {
  const context = useContext(noteContext);
  const navigate = useNavigate();
  const { note, getNotes, editNote, addNote } = context;

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
  const [pendingDeletes, setPendingDeletes] = useState(new Set());
  const [filterTag, setFilterTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalError, setModalError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ show: false, note: null, deleteAction: null, timeoutId: null });
  const [showSidebar, setShowSidebar] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Use external search query if provided (for desktop navbar search)
  const activeSearchQuery = externalSearchQuery !== undefined ? externalSearchQuery : searchQuery;

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getNotes();
    } else {
      navigate('/login');
    }
  }, [getNotes, navigate]);

  // Sync local notes with context notes, but exclude pending deletes
  useEffect(() => {
    if (note) {
      const filteredNotes = note.filter(n => !pendingDeletes.has(n._id));
      setLocalNotes(filteredNotes);
    }
  }, [note, pendingDeletes]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.filter-dropdown-container') && !event.target.closest('.filter-toggle-btn')) {
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

  if (activeSearchQuery) {
    filteredNotes = filteredNotes.filter(n =>
      n.title.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(activeSearchQuery.toLowerCase())
    );
  }

  if (filterTag) {
    filteredNotes = filteredNotes.filter(n => n.tag === filterTag);
  }

  // Sort by date (newest first)
  filteredNotes = [...filteredNotes].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
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

    // Add to pending deletes to prevent reappearing
    setPendingDeletes(prev => new Set([...prev, noteToDelete._id]));

    // Immediately remove note from UI for visual feedback
    setLocalNotes(prevNotes => prevNotes.filter(n => n._id !== noteToDelete._id));

    // Set timeout to execute actual deletion after 4 seconds
    const timeoutId = setTimeout(() => {
      deleteAction();
      setPendingDeletes(prev => {
        const newSet = new Set(prev);
        newSet.delete(noteToDelete._id);
        return newSet;
      });
      setSnackbar({ show: false, note: null, deleteAction: null, timeoutId: null });
    }, 4000);

    setSnackbar({ show: true, note: noteToDelete, deleteAction, timeoutId });
  };

  const handleUndoDelete = () => {
    // Clear the timeout to prevent deletion
    if (snackbar.timeoutId) {
      clearTimeout(snackbar.timeoutId);
    }

    // Remove from pending deletes
    if (snackbar.note) {
      setPendingDeletes(prev => {
        const newSet = new Set(prev);
        newSet.delete(snackbar.note._id);
        return newSet;
      });

      // Add back to local notes (check for duplicates)
      setLocalNotes(prevNotes => {
        const exists = prevNotes.find(n => n._id === snackbar.note._id);
        if (!exists) {
          return [...prevNotes, snackbar.note];
        }
        return prevNotes;
      });
    }

    // Close the snackbar
    setSnackbar({ show: false, note: null, deleteAction: null, timeoutId: null });
  };

  const handleCloseSnackbar = () => {
    // Clear timeout when manually closing
    if (snackbar.timeoutId) {
      clearTimeout(snackbar.timeoutId);
    }

    // If closing manually and there's a note, we should still keep it in pending deletes
    // since user didn't explicitly undo - this maintains the current behavior

    setSnackbar({ show: false, note: null, deleteAction: null, timeoutId: null });
  };

  const uniqueTags = [
    { Urgent: 'danger' },
    { Completed: 'success' },
    { Important: 'warning' },
    { Personal: 'info' },
  ];

  return (
    <div className="notes-container" style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
      {/* Sidebar */}
      <Sidebar
        notes={localNotes}
        filterTag={filterTag}
        setFilterTag={setFilterTag}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        onAddNote={openAddModal}
      />

      {/* Main Content */}
      <div style={{
        flex: 1,
        width: '100%',
      }}>
        <Container fluid className="px-4 py-3">
          <Row>
            <Col>

              <ModalForm
                show={showModal}
                onClose={handleModalClose}
                onSubmit={handleSubmit}
                modalError={modalError}
                noteData={notes}
                onChange={(e) => setNote({ ...notes, [e.target.name]: e.target.value })}
                isEditMode={isEditMode}
              />

              {/* Desktop Header - Your Notes with Grid/List Toggle */}
              <div className="d-none d-lg-flex align-items-center justify-content-between mb-4">
                <div>
                  <h2
                    className="mb-1"
                    style={{
                      fontSize: '1.75rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}
                  >
                    Your Notes
                  </h2>
                  <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
                    {filteredNotes.length} notes found
                  </p>
                </div>

                <div className="d-flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: viewMode === 'grid' ? 'none' : '1px solid var(--border-light)',
                      fontSize: '1.1rem',
                    }}
                    title="Grid View"
                  >
                    ▦
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: viewMode === 'list' ? 'none' : '1px solid var(--border-light)',
                      fontSize: '1.1rem',
                    }}
                    title="List View"
                  >
                    ☰
                  </button>
                </div>
              </div>

              {/* Search Bar - Mobile Only */}
              <div className="mb-4 d-lg-none">
                <div className="position-relative">
                  <i className="fas fa-search position-absolute" style={{
                    left: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    zIndex: 5,
                    fontSize: '1.1rem',
                  }}></i>
                  <Form.Control
                    type="text"
                    placeholder="Search notes..."
                    value={activeSearchQuery || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (externalSetSearchQuery) {
                        externalSetSearchQuery(value);
                      } else {
                        setSearchQuery(value);
                      }
                    }}
                    className="search-input"
                    style={{
                      paddingLeft: '2.5rem',
                      paddingRight: '2.5rem',
                      height: '38px',
                      fontSize: '1rem',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '10px',
                      color: 'var(--text-primary)',
                    }}
                  />
                  {/* Filter Icon - Mobile */}
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="btn btn-link position-absolute filter-toggle-btn"
                    style={{
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      zIndex: 5,
                      fontSize: '1.25rem',
                    }}
                    title="Filter"
                  >
                    <FontAwesomeIcon
                      icon={faFilter}
                      style={{
                        fontSize: '14px',
                        cursor: 'pointer'
                      }} />
                  </button>
                </div>
              </div>

              {/* Mobile Filter Dropdown */}
              {showDropdown && (
                <div className="d-lg-none mb-4 filter-dropdown-container">
                  <div
                    className="filter-dropdown-mobile rounded-4 p-3"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-light)',
                      boxShadow: 'var(--shadow-lg)',
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        Filter by Tags
                      </h6>
                      <button
                        onClick={() => setShowDropdown(false)}
                        className="btn btn-link p-0"
                        style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '1.25rem' }}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      <button
                        onClick={() => {
                          setFilterTag('');
                          setShowDropdown(false);
                        }}
                        className={`btn ${!filterTag ? 'btn-primary' : 'btn-outline-secondary'} text-start`}
                        style={{ borderRadius: '12px', padding: '0.75rem 1rem' }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span>📝 All Notes</span>
                          <Badge bg={!filterTag ? 'dark' : 'secondary'}>{localNotes.length}</Badge>
                        </div>
                      </button>
                      {uniqueTags.map(item => {
                        const tagName = Object.keys(item)[0];
                        const count = localNotes.filter(n => n.tag === tagName).length;
                        const tagIcons = {
                          Work: '💼',
                          Urgent: '⚠️',
                          Completed: '✅',
                          Important: '⭐',
                          Personal: '👤'
                        };
                        const icon = tagIcons[tagName] || '📌';
                        return (
                          <button
                            key={tagName}
                            onClick={() => {
                              setFilterTag(tagName);
                              setShowDropdown(false);
                            }}
                            className={`btn ${filterTag === tagName ? 'btn-primary' : 'btn-outline-secondary'} text-start`}
                            style={{ borderRadius: '12px', padding: '0.75rem 1rem' }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <span>{icon} {tagName}</span>
                              <Badge bg={filterTag === tagName ? 'dark' : 'secondary'}>{count}</Badge>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Header - Mobile Only */}
              <div className="d-lg-none d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-3">
                  <div>
                    <h2
                      className="mb-1"
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                      }}
                    >
                      Your Notes
                    </h2>
                    <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
                      {filteredNotes.length} notes found
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  {/* View Toggle + Add Button - Mobile */}
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: viewMode === 'grid' ? 'none' : '1px solid var(--border-light)',
                    }}
                    title="Grid View"
                  >
                    ▦
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: viewMode === 'list' ? 'none' : '1px solid var(--border-light)',
                    }}
                    title="List View"
                  >
                    ☰
                  </button>
                  {/* Add Note Button - Mobile */}
                  <button
                    onClick={openAddModal}
                    className="btn btn-primary"
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #00bf8f 0%, #001510 100%)',
                      border: 'none',
                      fontSize: '1.5rem',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                    }}
                    title="Add Note"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Notes Content */}
              <div className="position-relative" style={{ minHeight: '200px' }}>
                {filteredNotes.length === 0 && (
                  <div className="text-center py-5">
                    <div className="mb-3" style={{ fontSize: '4rem', opacity: 0.3 }}>📝</div>
                    <h5 style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>No Notes Found</h5>
                    <p style={{ color: 'var(--text-muted)' }}>
                      {searchQuery || filterTag ? 'Try adjusting your search or filter' : 'Create your first note to get started'}
                    </p>
                  </div>
                )}

                {filteredNotes.length > 0 && (
                  <div
                    className={viewMode === 'grid' ? 'notes-grid' : 'notes-list'}
                    style={{
                      display: viewMode === 'grid' ? 'grid' : 'flex',
                      gridTemplateColumns: viewMode === 'grid'
                        ? 'repeat(auto-fill, minmax(280px, 1fr))'
                        : 'none',
                      flexDirection: viewMode === 'list' ? 'column' : 'row',
                      gap: '1.5rem',
                      paddingBottom: '100px', // Space for FAB
                    }}
                  >
                    {filteredNotes.map((n, idx) => (
                      <div key={n._id || idx} className="fade-in">
                        <NotesItem
                          note={n}
                          updateNote={updateNote}
                          onShowSnackbar={handleShowSnackbar}
                          viewMode={viewMode}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* AI FAB - Always visible */}
      <AiFab />

      {/* Snackbar */}
      <Snackbar
        show={snackbar.show}
        message={`"${snackbar.note?.title}" deleted`}
        onUndo={handleUndoDelete}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
};

export default Notes;
