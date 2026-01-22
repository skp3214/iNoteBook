import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ModalForm = ({
  show,
  onClose,
  onSubmit,
  modalError,
  noteData,
  onChange,
  isEditMode = false
}) => {
  const tagOptions = [
    { value: 'Work', label: 'Work', variant: 'primary', color:'#2563eb' },
    { value: 'Urgent', label: 'Urgent', variant: 'danger', color:'#ef4444' },
    { value: 'Completed', label: 'Completed', variant: 'success', color:'#22c55e' },
    { value: 'Important', label: 'Important', variant: 'warning', color:'#eab308' },
    { value: 'Personal', label: 'Personal', variant: 'info', color:'#8b5cf6' },
  ];

  return (
    <Modal show={show} onHide={onClose} centered className="modern-modal">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="modern-title d-flex align-items-center">
          <span className="me-2" style={{ fontSize: '1.5rem' }}>
            {isEditMode ? '✏️' : '📝'}
          </span>
          {isEditMode ? 'Edit Note' : 'Create New Note'}
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
              name={isEditMode ? "etitle" : "title"}
              value={isEditMode ? noteData.etitle : noteData.title}
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
              name={isEditMode ? "edescription" : "description"}
              value={isEditMode ? noteData.edescription : noteData.description}
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
              name={isEditMode ? "etag" : "tag"}
              value={isEditMode ? noteData.etag : noteData.tag}
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
                    padding: '0.5rem',
                    color: option.color
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
          <span className="me-2">{isEditMode ? '💾' : '➕'}</span>
          {isEditMode ? 'Update Note' : 'Add Note'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalForm;
