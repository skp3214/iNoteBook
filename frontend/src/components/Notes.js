import React, { useContext, useEffect, useState, useRef } from 'react';
import NotesItem from './NotesItem';
import AddNote from './AddNote';
import noteContext from '../context/notes/noteContext';
import { useNavigate } from 'react-router-dom';

const Notes = () => {
  let context = useContext(noteContext);
  let navigate = useNavigate();
  const { note, getNotes, editNote } = context;
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
  const ref = useRef(null)
  const updateNote = (currentNote) => {
    ref.current.click()
    setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });
  }
  const newref = useRef(null)

  const handleClick = (e) => {
    e.preventDefault();
    editNote(notes.id, notes.etitle, notes.edescription, notes.etag)
    newref.current.click();

    // Optionally, you can clear the form after submitting
    setNote({
      title: '',
      description: '',
      tag: ''
    });
  };

  const onChange = (e) => {
    setNote({ ...notes, [e.target.name]: e.target.value });
  };

  return (
    <div className='row gap-4'>
      <AddNote />
      <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>
      <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit Notes</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">


              <div className="mb-3">
                <label htmlFor="formTitle" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="etitle"
                  placeholder="Enter title"
                  name="etitle"
                  value={notes.etitle}
                  onChange={onChange}
                  minLength={5}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="formDescription" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="edescription"
                  rows={3}
                  placeholder="Enter description"
                  name="edescription"
                  value={notes.edescription}
                  onChange={onChange}
                  minLength={5}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="formTag" className="form-label">
                  Tag
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="etag"
                  placeholder="Enter tag"
                  name="etag"
                  value={notes.etag}
                  minLength={3}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button ref={newref} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
            </div>
          </div>
        </div>
      </div>
      <div className='container'>
        <h2>Your Notes</h2>
        <div className='d-flex py-2 flex-wrap' >
          {note.length === 0 && 'No Notes to display'}
          {note.map((n) => {
            return <NotesItem key={n._id} note={n} updateNote={updateNote} />
          }
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
