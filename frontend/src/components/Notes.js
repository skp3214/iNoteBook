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
  const [viewMode, setViewMode] = useState('grid');
  const [sortOrder, setSortOrder] = useState('date');

  const [isLoading, setIsLoading] = useState(true);

  const activeSearchQuery = externalSearchQuery !== undefined ? externalSearchQuery : searchQuery;

  // Fetch notes with loading control
  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true); // Start loading

      if (localStorage.getItem('token')) {
        await getNotes();
      } else {
        navigate('/login');
      }

      setIsLoading(false); // Done loading
    };

    fetchNotes();
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

  useEffect(() => {
    return () => {
      if (snackbar.timeoutId) {
        clearTimeout(snackbar.timeoutId);
      }
    };
  }, [snackbar.timeoutId]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setShowSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
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

  if (sortOrder === 'priority') {
    const priorityOrder = { 'Urgent': 1, 'Important': 2, 'Work': 3, 'Personal': 4, 'Completed': 5 };
    filteredNotes = [...filteredNotes].sort((a, b) => {
      const aPriority = priorityOrder[a.tag] || 6;
      const bPriority = priorityOrder[b.tag] || 6;
      return aPriority - bPriority;
    });
  } else {
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
    if (snackbar.timeoutId) {
      clearTimeout(snackbar.timeoutId);
    }

    setPendingDeletes(prev => new Set([...prev, noteToDelete._id]));

    setLocalNotes(prevNotes => prevNotes.filter(n => n._id !== noteToDelete._id));

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
    if (snackbar.timeoutId) {
      clearTimeout(snackbar.timeoutId);
    }

    if (snackbar.note) {
      setPendingDeletes(prev => {
        const newSet = new Set(prev);
        newSet.delete(snackbar.note._id);
        return newSet;
      });

      setLocalNotes(prevNotes => {
        const exists = prevNotes.find(n => n._id === snackbar.note._id);
        if (!exists) {
          return [...prevNotes, snackbar.note];
        }
        return prevNotes;
      });
    }

    setSnackbar({ show: false, note: null, deleteAction: null, timeoutId: null });
  };

  const handleCloseSnackbar = () => {
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
      <Sidebar
        notes={localNotes}
        filterTag={filterTag}
        setFilterTag={setFilterTag}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        onAddNote={openAddModal}
      />

      <div style={{ flex: 1, width: '100%' }}>
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

              <DesktopHeader
                sortOrder={sortOrder}
                viewMode={viewMode}
                toggleSortOrder={toggleSortOrder}
                setViewMode={setViewMode}
                filteredNotes={filteredNotes}
              />

              <SearchBar
                externalSetSearchQuery={externalSetSearchQuery}
                setSearchQuery={setSearchQuery}
                setShowDropdown={setShowDropdown}
                showDropdown={showDropdown}
                activeSearchQuery={activeSearchQuery}
              />

              {showDropdown && (
                <MobileFilterDropDown
                  localNotes={localNotes}
                  filterTag={filterTag}
                  setFilterTag={setFilterTag}
                  setShowDropdown={setShowDropdown}
                />
              )}

              <MobileHeader
                sortOrder={sortOrder}
                openAddModal={openAddModal}
                viewMode={viewMode}
                setViewMode={setViewMode}
                filteredNotes={filteredNotes}
                toggleSortOrder={toggleSortOrder}
              />

              {/* Notes Content with Loading Spinner */}
              <div className="position-relative" style={{ minHeight: '400px' }}>
                {isLoading ? (
                  <div className="d-flex flex-column align-items-center justify-content-center border-0" style={{ minHeight: '300px' }}>
                    <div className="modern-ring-spinner mb-4"></div>
                    <p className="fw-semibold text-primary" style={{ fontSize: '1.2rem', letterSpacing: '0.5px' }}>Loading your notes...</p>
                  </div>
                ) : filteredNotes.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="mb-3" style={{ fontSize: '4rem', opacity: 0.3 }}>📝</div>
                    <h5 style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>No Notes Found</h5>
                    <p style={{ color: 'var(--text-muted)' }}>
                      {searchQuery || filterTag ? 'Try adjusting your search or filter' : 'Create your first note to get started'}
                    </p>
                  </div>
                ) : (
                  <div
                    className={viewMode === 'grid' ? 'notes-grid' : 'notes-list'}
                    style={{
                      display: viewMode === 'grid' ? 'grid' : 'flex',
                      gridTemplateColumns: viewMode === 'grid'
                        ? 'repeat(auto-fill, minmax(280px, 1fr))'
                        : 'none',
                      flexDirection: viewMode === 'list' ? 'column' : 'row',
                      gap: '1.5rem',
                      paddingBottom: '100px',
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

      <AiFab />

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