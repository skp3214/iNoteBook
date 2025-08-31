import { useContext, useEffect, useState } from 'react';
import NotesItem from './NotesItem';
import AddNote from './AddNote';
import noteContext from '../context/notes/noteContext';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import ModalForm from './ModalForm';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Notes = () => {
  const context = useContext(noteContext);
  const navigate = useNavigate();
  const { note, getNotes, editNote, isOnline} = context;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getNotes();
    } else {
      navigate('/login');
    }
  }, [getNotes, navigate]);

  const [notes, setNote] = useState({
    id: '',
    etitle: '',
    edescription: '',
    etag: ''
  });
  const [filterTag, setFilterTag] = useState('');
  const [sortAlpha, setSortAlpha] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalError, setModalError] = useState('');

  let filteredNotes = note;

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

  const [showModal, setShowModal] = useState(false);

  const updateNote = (currentNote) => {
    setShowModal(true);
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalError('');
    setNote({
      id: '',
      etitle: '',
      edescription: '',
      etag: ''
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();

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

    setLoading(true);
    try {
      await editNote(notes.id, notes.etitle.trim(), notes.edescription.trim(), notes.etag);
    } finally {
      setLoading(false);
      handleModalClose();
    }
  };

  const uniqueTags = [
    { Work: 'primary' },
    { Urgent: 'danger' },
    { Completed: 'success' },
    { Important: 'warning' },
    { Personal: 'info' },
  ];

  return (
    <Container fluid className="px-4 py-3">
      <Row>
        <Col lg={10} xl={8} className="mx-auto">
          <AddNote />
          
          <ModalForm
            show={showModal}
            onClose={handleModalClose}
            onSubmit={handleClick}
            modalError={modalError}
            noteData={notes}
            onChange={(e) => setNote({ ...notes, [e.target.name]: e.target.value })}
            uniqueTags={uniqueTags}
          />
          
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h2 className="modern-title h3 mb-2">Your Notes</h2>
                <p className="modern-text text-muted mb-0">
                  {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
                </p>
              </div>
              
              <div className={`modern-status ${isOnline ? 'online' : 'offline'}`}>
                {isOnline ? 'Online' : 'Offline Mode'}
              </div>
            </div>

            {!isOnline && (
              <div className="modern-alert alert-warning mb-4">
                <strong>Offline Mode:</strong> Changes will sync when you're back online
              </div>
            )}

            <div className="modern-search mb-4">
              <Form.Control
                type="text"
                placeholder="Search notes by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="modern-input"
              />
            </div>

            <div className="filter-section">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="modern-text fw-medium">Filter by category:</span>
                <button 
                  className='modern-filter-btn' 
                  onClick={() => setSortAlpha(a => !a)}
                >
                  Sort {sortAlpha ? 'A-Z' : 'Z-A'}
                </button>
              </div>
              
              <Row className="g-2">
                <Col xs={6} sm={4} md={3} lg={2}>
                  <button 
                    className={`modern-filter-btn w-100 ${filterTag === '' ? 'active' : ''}`} 
                    onClick={() => setFilterTag('')}
                  >
                    All
                  </button>
                </Col>
                {uniqueTags.map(item => (
                  <Col xs={6} sm={4} md={3} lg={2} key={Object.keys(item)[0]}>
                    <button
                      className={`modern-filter-btn w-100 ${filterTag === Object.keys(item)[0] ? 'active' : ''}`}
                      onClick={() => setFilterTag(Object.keys(item)[0])}
                    >
                      {Object.keys(item)[0]}
                    </button>
                  </Col>
                ))}
              </Row>
            </div>

            <div className="position-relative" style={{ minHeight: '200px' }}>
              {loading && (
                <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-light bg-opacity-75 rounded" style={{ zIndex: 10 }}>
                  <Spinner animation="border" role="status" className="modern-spinner">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              )}

              {filteredNotes.length === 0 && !loading && (
                <div className="text-center py-5">
                  <div className="mb-3" style={{ fontSize: '3rem', opacity: 0.3 }}>📝</div>
                  <h5 className="modern-title text-muted">No Notes Found</h5>
                  <p className="modern-text text-muted">
                    {searchQuery || filterTag ? 'Try adjusting your search or filter' : 'Create your first note to get started'}
                  </p>
                </div>
              )}
              
              {!loading && filteredNotes.length > 0 && (
                <div className="modern-grid">
                  {filteredNotes.map((n, idx) => (
                    <div key={n._id || idx} className="fade-in">
                      <NotesItem note={n} updateNote={updateNote} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Notes;