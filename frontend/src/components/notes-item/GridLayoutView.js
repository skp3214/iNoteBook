import { faTrash} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import DropDownMenu from './DropDownMenu';


const GridLayoutView = ({ tagInfo, isDragging, handleDeleteClick, updateNote, note, swipeX, handleTouchStart, tagLabel, handleTouchMove, handleTouchEnd }) => {
    return (
        <>
            <div className="gradient-card-container" style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Delete background */}
                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: '80px',
                        background: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '16px',
                        opacity: Math.abs(swipeX) / 100
                    }}
                >
                    <FontAwesomeIcon icon={faTrash} style={{ color: 'white', fontSize: '1.2rem' }} />
                </div>

                <Card
                    className="gradient-note-card"
                    style={{
                        background: tagInfo.gradient,
                        border: `2px solid ${tagInfo.borderColor}`,
                        borderRadius: '20px',
                        width: '100%',
                        minHeight: '220px',
                        position: 'relative',
                        overflow: 'hidden',
                        transform: `translateX(${swipeX}px)`,
                        transition: isDragging ? 'none' : 'transform 0.3s ease',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <Card.Body className="d-flex flex-column justify-content-between h-100 p-4">
                        <div>
                            <Card.Title
                                className="text-white mb-2"
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontWeight: 700,
                                    fontSize: '1.35rem',
                                    lineHeight: 1.3,
                                }}
                            >
                                {note.title}
                            </Card.Title>
                            <Card.Text
                                className="text-white mb-2"
                                style={{
                                    opacity: 0.95,
                                    fontSize: '0.95rem',
                                    lineHeight: 1.7,
                                    // minHeight: '60px',
                                    // display: '-webkit-box',
                                    // WebkitLineClamp: 3,
                                    // WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}
                            >
                                {note.description}
                            </Card.Text>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-auto">
                            <div className="d-flex align-items-center gap-2">
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

                            {/* Three-dot dropdown menu moved to bottom-right */}
                            <DropDownMenu
                                note={note}
                                updateNote={updateNote}
                                handleDeleteClick={handleDeleteClick}
                            />
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}

export default GridLayoutView