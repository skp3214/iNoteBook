import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import Card from 'react-bootstrap/Card';
import noteContext from '../context/notes/noteContext';


const NotesItem = (props) => {
    const context = useContext(noteContext);
    const { deleteNote } = context;
    const { note,updateNote } = props;
  
    const handleDeleteClick = () => {
      console.log('Deleting note with ID:', note._id);
      deleteNote(note._id);
    };
  
    return (
      <Card style={{ width: '18rem' }} className='me-4'>
        <Card.Body>
          <Card.Title>{note.title}</Card.Title>
          <Card.Text>{note.description}</Card.Text>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <FontAwesomeIcon
              icon={faTrash}
              style={{ color: 'red', marginRight: '5px', cursor: 'pointer' }}
              onClick={handleDeleteClick}
            />
  
            <FontAwesomeIcon icon={faEdit} style={{ color: 'blue', marginLeft: '5px', cursor: 'pointer' }}
            onClick={()=>updateNote(note)}
            />
          </div>
        </Card.Body>
      </Card>
    );
  };

export default NotesItem;
