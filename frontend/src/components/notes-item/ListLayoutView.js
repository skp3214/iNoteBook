import React from 'react'
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import DropDownMenu from './DropDownMenu';

const ListLayoutView = ({ tagInfo, note, updateNote, isDropdownOpen, tagLabel, setIsDropdownOpen, handleDeleteClick }) => {
    return (
        <><Card
            className="list-note-card"
            style={{
                background: tagInfo.gradient,
                border: `2px solid ${tagInfo.borderColor}`,
                borderRadius: '20px',
                width: '100%',
                position: 'relative',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                zIndex: isDropdownOpen ? 1050 : 1,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.25)';
                e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <Card.Body className="d-flex align-items-center p-4">
                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="d-flex align-items-start justify-content-between mb-2">
                        <Card.Title
                            className="mb-2 text-white"
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 700,
                                fontSize: '1.25rem',
                                flex: 1,
                            }}
                        >
                            {note.title}
                        </Card.Title>
                    </div>

                    <Card.Text
                        className="mb-3 text-white"
                        style={{
                            opacity: 0.95,
                            fontSize: '0.95rem',
                            lineHeight: 1.6,
                            // display: '-webkit-box',
                            // WebkitLineClamp: 2,
                            // WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {note.description}
                    </Card.Text>

                    <div className="d-flex align-items-center gap-3">
                        {note.tag && tagLabel !== 'No Tag' && (
                            <Badge
                                bg='white'
                                style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    padding: '0.35rem 0.75rem',
                                    background: 'rgba(255, 255, 255, 0.25)',
                                    color: `${tagInfo.borderColor}`,
                                    border: 'none',
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
                                {new Date(note.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        )}
                    </div>
                </div>

                {/* Right: Dropdown Menu */}
                <DropDownMenu
                    note={note}
                    updateNote={updateNote}
                    handleDeleteClick={handleDeleteClick}
                />
            </Card.Body>
        </Card></>
    )
}

export default ListLayoutView