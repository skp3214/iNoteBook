import { useContext, useState } from 'react';
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
    e.preventDefault(); 
    handleClick(e); 
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
          <Form.Select
            name="tag"
            value={note.tag}
            onChange={onChange}
            required
          >
            <option value="">Select tag</option>
            <option value="Work" style={{ color: '#0d6efd', fontWeight: 'bold' }}>Work</option>
            <option value="Urgent" style={{ color: '#dc3545', fontWeight: 'bold' }}>Urgent</option>
            <option value="Completed" style={{ color: '#198754', fontWeight: 'bold' }}>Completed</option>
            <option value="Important" style={{ color: '#ffc107', fontWeight: 'bold' }}>Important</option>
            <option value="Personal" style={{ color: '#0dcaf0', fontWeight: 'bold' }}>Personal</option>
          </Form.Select>
        </Form.Group>

        <Button  variant="primary" className="mt-4" type="submit">
          Add Note
        </Button>
      </Form>
    </div>
  );
};

export default AddNote;
