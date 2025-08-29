import { useContext, useEffect, useState } from 'react';
import NotesItem from './NotesItem';
import AddNote from './AddNote';
import noteContext from '../context/notes/noteContext';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


const Notes = () => {
  let context = useContext(noteContext);
  let navigate = useNavigate();
  const { note, getNotes, editNote, isOnline } = context;
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
  if (sortAlpha) {
    filteredNotes = [...filteredNotes].sort((a, b) => a.title.localeCompare(b.title));
  } else {
    filteredNotes = [...filteredNotes].sort((a, b) => b.title.localeCompare(a.title));
  }
  const [showModal, setShowModal] = useState(false);
  const updateNote = (currentNote) => {
    setShowModal(true);
    setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });
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

  const handleClick = (e) => {
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
    
    editNote(notes.id, notes.etitle.trim(), notes.edescription.trim(), notes.etag);
    handleModalClose();
  };

  const onChange = (e) => {
    setNote({ ...notes, [e.target.name]: e.target.value });
  };

  const uniqueTags = [{
    Work: 'primary',
  }, {
    Urgent: 'danger',
  }, {
    Completed: 'success',
  }, {
    Important: 'warning',
  }, {
    Personal: 'info',
  }];



  return (
    <div className='row gap-4'>
      <AddNote />
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalError && (
            <div className="alert alert-danger" role="alert">
              {modalError}
            </div>
          )}
          <Form>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                name="etitle"
                value={notes.etitle}
                onChange={onChange}
                className="theme-input"
                minLength={2}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                name="edescription"
                value={notes.edescription}
                onChange={onChange}
                className="theme-input"
                minLength={2}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTag">
              <Form.Label>Tag</Form.Label>
              <Form.Select
                name="etag"
                value={notes.etag}
                onChange={onChange}
                className="theme-input"
                required
              >
                <option value="">Select tag</option>
                {uniqueTags.map(item => (
                  <option key={Object.keys(item)[0]} value={Object.keys(item)[0]}>{[Object.keys(item)[0]]}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>Close</Button>
          <Button variant="primary" onClick={handleClick}>Update Note</Button>
        </Modal.Footer>
      </Modal>
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
        <div className='d-flex py-2 flex-wrap' >
          {filteredNotes.length === 0 && 'No Notes to display'}
          {filteredNotes.map((n, idx) => (
            <div key={n._id || idx} className="m-3">
              <NotesItem note={n} updateNote={updateNote} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notes;
