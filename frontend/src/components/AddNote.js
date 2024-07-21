import React, { useContext, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import noteContext from '../context/notes/noteContext';

const AddNote = () => {
  const context = useContext(noteContext);
  const { addNote } = context;
  const [note, setNote] = useState({
    title: '',
    description: '',
    tag: ''
  });

  const handleClick = (e) => {
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    // Optionally, you can clear the form after submitting
    setNote({
      title: '',
      description: '',
      tag: ''
    });
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    handleClick(e); // Call your handleClick function for form submission logic
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            name="title"
            value={note.title}
            onChange={onChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter description"
            name="description"
            value={note.description}
            onChange={onChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formTag">
          <Form.Label>Tag</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter tag"
            name="tag"
            value={note.tag}
            onChange={onChange}
          />
        </Form.Group>

        <Button  variant="primary" className="mt-4" type="submit">
          Add Note
        </Button>
      </Form>
    </div>
  );
};

export default AddNote;
