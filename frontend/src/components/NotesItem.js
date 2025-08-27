import { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import noteContext from '../context/notes/noteContext';

const NotesItem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note, updateNote } = props;

  const handleDeleteClick = () => {
    console.log('Deleting note with ID:', note._id);
    deleteNote(note._id);
  };

  const tagLabelMap = {
    Work: 'primary',
    Urgent: 'danger',
    Completed: 'success',
    Important: 'warning',
    Personal: 'info',
  };
  const badgeColor = tagLabelMap[note.tag];
  const tagLabel = note.tag || 'No Tag';

  return (
    <Card
      className={`me-4 border-2 shadow-sm border-${badgeColor}`}
      style={{ width: '20rem' }} 
    >
      <Card.Header
        className="bg-white border-0 pb-0 d-flex justify-content-between align-items-center"
        style={{ borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}
      >
        {note.tag && tagLabel !== 'No Tag' && (
          <Badge
            bg={badgeColor}
            style={{ fontSize: '1em', padding: '0.5em 1em' }}
          >
            {tagLabel}
          </Badge>
        )}
      </Card.Header>
      <Card.Body>
        <Card.Title className="mb-2" style={{ fontWeight: 600 }}>
          {note.title}
        </Card.Title>
        <Card.Text style={{ minHeight: '60px' }}>{note.description}</Card.Text>
      </Card.Body>
      <Card.Footer
        className="bg-white border-0 pt-0 d-flex justify-content-between"
        style={{
          borderBottomLeftRadius: '1rem',
          borderBottomRightRadius: '1rem',
        }}
      >
        <FontAwesomeIcon
          icon={faEdit}
          style={{
            color: '#0d6efd',
            cursor: 'pointer',
            fontSize: '1.2em',
          }}
          onClick={() => updateNote(note)}
          title="Edit Note"
        />
        <FontAwesomeIcon
          icon={faTrash}
          style={{
            color: '#dc3545',
            cursor: 'pointer',
            fontSize: '1.2em',
          }}
          onClick={handleDeleteClick}
          title="Delete Note"
        />
      </Card.Footer>
    </Card>
  );
};

export default NotesItem;
