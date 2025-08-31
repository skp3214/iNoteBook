import { useContext, useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
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

  const tagOptions = [
    { value: 'Work', label: 'Work', variant: 'primary' },
    { value: 'Urgent', label: 'Urgent', variant: 'danger' },
    { value: 'Completed', label: 'Completed', variant: 'success' },
    { value: 'Important', label: 'Important', variant: 'warning' },
    { value: 'Personal', label: 'Personal', variant: 'info' },
  ];

  return (
    <Card className="modern-card-elevated mb-4">
      <Card.Body className="p-4">
        <div className="d-flex align-items-center mb-4">
          
          <div>
            <h4 className="modern-title mb-1">Create New Note</h4>
            <p className="modern-text text-muted mb-0" style={{ fontSize: '0.9rem' }}>
              Capture your thoughts and ideas
            </p>
          </div>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label className="modern-text fw-medium mb-2">Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a descriptive title..."
              name="title"
              value={note.title}
              onChange={onChange}
              className="modern-input"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label className="modern-text fw-medium mb-2">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Write your note content here..."
              name="description"
              value={note.description}
              onChange={onChange}
              className="modern-input"
              required
              style={{ resize: 'vertical', minHeight: '100px' }}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formTag">
            <Form.Label className="modern-text fw-medium mb-2">Category</Form.Label>
            <Form.Select
              name="tag"
              value={note.tag}
              onChange={onChange}
              className="modern-input"
              required
            >
              <option value="">Choose a category...</option>
              {tagOptions.map(option => (
                <option
                  key={option.value}
                  value={option.value}
                  style={{
                    fontWeight: '500',
                    padding: '0.5rem'
                  }}
                >
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button
              type="submit"
              className="modern-btn modern-btn-solid px-4 py-2"
              disabled={!note.title.trim() || !note.description.trim() || !note.tag}
            >
              Add Note
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddNote;