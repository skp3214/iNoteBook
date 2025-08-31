import { useContext, useEffect, useState } from 'react';
import NotesItem from './NotesItem';
import AddNote from './AddNote';
import noteContext from '../context/notes/noteContext';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import ModalForm from './ModalForm';
import Spinner from 'react-bootstrap/Spinner';

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
    <div className='row gap-4'>
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
      <div className='container'>
        <h2>Your Notes</h2>

        {/* Online/Offline Status Indicator */}
        <div className='mb-2'>
          <span className={`badge ${isOnline ? 'bg-success' : 'bg-warning'}`}>
            {isOnline ? 'Online' : 'Offline Mode'}
          </span>
          {!isOnline && (
            <small className='text-muted ms-2'>
              Changes will sync when you're back online
            </small>
          )}
        </div>

        <div className='mb-3'>
          <Form.Control
            type="text"
            placeholder="Search notes by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-10 theme-input"
          />
        </div>

        <div className='mb-3 d-flex flex-wrap gap-2'>
          <button className={`btn btn-outline-primary btn-sm${filterTag === '' ? ' active' : ''}`} onClick={() => setFilterTag('')}>All</button>
          {uniqueTags.map(item => (
            <button
              key={Object.keys(item)[0]}
              className={`btn btn-outline-${item[Object.keys(item)[0]]} btn-sm${filterTag === Object.keys(item)[0] ? ' active' : ''}`}
              onClick={() => setFilterTag(Object.keys(item)[0])}
            >
              {Object.keys(item)[0]}
            </button>
          ))}
          <button className='btn btn-outline-secondary btn-sm ms-3' onClick={() => setSortAlpha(a => !a)}>
            Sort {sortAlpha ? 'A-Z' : 'Z-A'}
          </button>
        </div>

        <div className='d-flex py-2 flex-wrap position-relative' style={{ minHeight: '100px' }}>
          {loading && (
            <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-light bg-opacity-75" style={{ zIndex: 10 }}>
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}

          {filteredNotes.length === 0 && !loading && 'No Notes to display'}
          {!loading &&
            filteredNotes.map((n, idx) => (
              <div key={n._id || idx} className="m-3">
                <NotesItem note={n} updateNote={updateNote} />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Notes;
