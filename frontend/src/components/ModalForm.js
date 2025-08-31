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
  return (
    <Modal show={show} onHide={onClose} centered>
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
              value={noteData.etitle}
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
              value={noteData.edescription}
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
              value={noteData.etag}
              onChange={onChange}
              className="theme-input"
              required
            >
              <option value="">Select tag</option>
              {uniqueTags.map(item => (
                <option
                  key={Object.keys(item)[0]}
                  value={Object.keys(item)[0]}
                >
                  {Object.keys(item)[0]}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Update Note
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalForm;
