import { useContext, useEffect, useState } from 'react';
import NotesItem from './NotesItem';
import noteContext from '../context/notes/noteContext';
import { useNavigate } from 'react-router-dom';
import ModalForm from './ModalForm';
import Snackbar from './Snackbar';
import Sidebar from './Sidebar';
import AiFab from './AiFab';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SearchBar from './notes/SearchBar';
import MobileFilterDropDown from './notes/MobileFilterDropDown';
import DesktopHeader from './notes/DesktopHeader';
import MobileHeader from './notes/MobileHeader';

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
  const [sortOrder, setSortOrder] = useState('date'); // 'date' or 'priority'

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

  // Handle sidebar visibility on window resize
  useEffect(() => {
    const handleResize = () => {
      // Close sidebar when resizing to mobile view (< 992px)
      if (window.innerWidth < 992) {
        setShowSidebar(false);
      }
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Initial check on mount
    handleResize();

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Sort notes based on selected sort order
  if (sortOrder === 'priority') {
    const priorityOrder = { 'Urgent': 1, 'Important': 2, 'Work': 3, 'Personal': 4, 'Completed': 5 };
    filteredNotes = [...filteredNotes].sort((a, b) => {
      const aPriority = priorityOrder[a.tag] || 6;
      const bPriority = priorityOrder[b.tag] || 6;
      return aPriority - bPriority;
    });
  } else {
    // Sort by date (newest first)
    filteredNotes = [...filteredNotes].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );
  }

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

    setSnackbar({ show: false, note: null, deleteAction: null, timeoutId: null });
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'date' ? 'priority' : 'date');
  };



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
              <DesktopHeader
                sortOrder={sortOrder}
                viewMode={viewMode}
                toggleSortOrder={toggleSortOrder}
                setViewMode={setViewMode}
                filteredNotes={filteredNotes}
              />

              {/* Search Bar - Mobile Only */}
              <SearchBar
                externalSetSearchQuery={externalSearchQuery}
                setSearchQuery={setSearchQuery}
                setShowDropdown={setShowDropdown}
                showDropdown={showDropdown}
                activeSearchQuery={activeSearchQuery}
              />

              {/* Mobile Filter Dropdown */}
              {showDropdown && (
                <MobileFilterDropDown
                  localNotes={localNotes}
                  filterTag={filterTag}
                  setFilterTag={setFilterTag}
                  setShowDropdown={setShowDropdown}
                />
              )}

              {/* Header - Mobile Only */}
              <MobileHeader
                sortOrder={sortOrder}
                openAddModal={openAddModal}
                viewMode={viewMode}
                setViewMode={setViewMode}
                filteredNotes={filteredNotes}
                toggleSortOrder={toggleSortOrder}
              />

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
        message={`${snackbar.note?.title} deleted`}
        onUndo={handleUndoDelete}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
};

export default Notes;
