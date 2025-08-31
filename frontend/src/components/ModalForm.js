import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ModalForm = ({
  show,
  onClose,
  onSubmit,
  modalError,
  noteData,
  onChange,
  uniqueTags
}) => {
  const tagOptions = [
    { value: 'Work', label: 'Work', variant: 'primary' },
    { value: 'Urgent', label: 'Urgent', variant: 'danger' },
    { value: 'Completed', label: 'Completed', variant: 'success' },
    { value: 'Important', label: 'Important', variant: 'warning' },
    { value: 'Personal', label: 'Personal', variant: 'info' },
  ];

  return (
    <Modal show={show} onHide={onClose} centered className="modern-modal">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="modern-title d-flex align-items-center">
          <span className="me-2" style={{ fontSize: '1.5rem' }}>✏️</span>
          Edit Note
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="px-4">
        {modalError && (
          <div className="modern-alert alert-danger" role="alert">
            <strong>Error:</strong> {modalError}
          </div>
        )}
        
        <Form>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label className="modern-text fw-medium mb-2">Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a descriptive title..."
              name="etitle"
              value={noteData.etitle}
              onChange={onChange}
              className="modern-input"
              minLength={2}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label className="modern-text fw-medium mb-2">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Write your note content here..."
              name="edescription"
              value={noteData.edescription}
              onChange={onChange}
              className="modern-input"
              minLength={2}
              required
              style={{ resize: 'vertical', minHeight: '100px' }}
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formTag">
            <Form.Label className="modern-text fw-medium mb-2">Category</Form.Label>
            <Form.Select
              name="etag"
              value={noteData.etag}
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
        </Form>
      </Modal.Body>
      
      <Modal.Footer className="border-0 px-4">
        <Button 
          variant="outline-secondary" 
          onClick={onClose}
          className="modern-btn modern-btn-outline me-2"
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={onSubmit}
          className="modern-btn modern-btn-primary"
        >
          <span className="me-2">💾</span>
          Update Note
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalForm;