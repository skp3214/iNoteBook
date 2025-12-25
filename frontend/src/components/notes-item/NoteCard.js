import React from 'react';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

const NoteCard = ({ tagInfo, note, tagLabel, children  }) => {
  return (
    <Card
      className="note-card-common"
      style={{
        background: tagInfo.gradient,
        border: `2px solid ${tagInfo.borderColor}`,
        borderRadius: '20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Card.Body className="d-flex flex-column p-4 h-100">
        {/* Title */}
        <Card.Title
          className="text-white mb-3"
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '1.35rem',
            lineHeight: 1.3,
          }}
        >
          {note.title}
        </Card.Title>

        {/* Description */}
        <Card.Text
          className="text-white flex-grow-1 mb-4"
          style={{
            opacity: 0.95,
            fontSize: '0.95rem',
            lineHeight: 1.7,
            overflow: 'hidden',
          }}
        >
          {note.description}
        </Card.Text>

        {/* Footer: Tag + Date */}
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div className="d-flex align-items-center gap-3">
            {note.tag && tagLabel !== 'No Tag' && (
              <Badge
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  padding: '0.35rem 0.75rem',
                  background: 'rgba(255, 255, 255, 0.25)',
                  color: `${tagInfo.borderColor}`,
                  borderRadius: '8px',
                }}
              >
                {tagLabel.toUpperCase()}
              </Badge>
            )}
            {note.date && (
              <span
                className="text-white"
                style={{
                  fontSize: '0.75rem',
                  opacity: 0.8,
                }}
              >
                {new Date(note.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>

          {/* This is where actions dropdown will go in parent */}
          {children}
        </div>
      </Card.Body>
    </Card>
  );
};

export default NoteCard;