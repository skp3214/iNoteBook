import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { faBriefcase, faExclamationTriangle, faUser, faStar, faCheck,faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { Badge } from 'react-bootstrap';


const MobileFilterDropDown = ({localNotes,filterTag,setFilterTag,setShowDropdown}) => {
    return (
        <><div className="d-lg-none mb-4 filter-dropdown-container">
            <div
                className="filter-dropdown-mobile rounded-4 p-3"
                style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-lg)',
                }}
            >
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        Filter by Tags
                    </h6>
                    <button
                        onClick={() => setShowDropdown(false)}
                        className="btn btn-link p-0"
                        style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '1.25rem' }}
                    >
                        ✕
                    </button>
                </div>
                <div className="d-flex flex-column gap-2">
                    {[
                        { name: 'All Notes', icon: <FontAwesomeIcon icon={faClipboardList} style={{ color: '#8b5cf6' }} />, color: '#8b5cf6', count: localNotes.length },
                        { name: 'Work', icon: <FontAwesomeIcon icon={faBriefcase} style={{ color: '#3b82f6' }} />, color: '#3b82f6', count: localNotes.filter(n => n.tag === 'Work').length },
                        { name: 'Urgent', icon: <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#ef4444' }} />, color: '#ef4444', count: localNotes.filter(n => n.tag === 'Urgent').length },
                        { name: 'Personal', icon: <FontAwesomeIcon icon={faUser} style={{ color: '#06b6d4' }} />, color: '#06b6d4', count: localNotes.filter(n => n.tag === 'Personal').length },
                        { name: 'Important', icon: <FontAwesomeIcon icon={faStar} style={{ color: '#f59e0b' }} />, color: '#f59e0b', count: localNotes.filter(n => n.tag === 'Important').length },
                        { name: 'Completed', icon: <FontAwesomeIcon icon={faCheck} style={{ color: '#10b981' }} />, color: '#10b981', count: localNotes.filter(n => n.tag === 'Completed').length },
                    ].map((tag) => {
                        const isActive = (tag.name === 'All Notes' && !filterTag) || (tag.name === filterTag);
                        const tagName = tag.name === 'All Notes' ? '' : tag.name;

                        return (
                            <button
                                key={tag.name}
                                onClick={() => {
                                    setFilterTag(tagName);
                                    setShowDropdown(false);
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: isActive ? 'var(--bg-elevated)' : 'transparent',
                                    color: 'var(--text-primary)',
                                    fontWeight: isActive ? 600 : 500,
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                                    width: '100%',
                                }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <span style={{ fontSize: '1rem' }}>{tag.icon}</span>
                                    <span>{tag.name}</span>
                                </div>
                                <Badge
                                    bg="secondary"
                                    pill
                                    style={{
                                        background: tag.color,
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        padding: '0.35rem 0.55rem',
                                    }}
                                >
                                    {tag.count}
                                </Badge>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div></>
    )
}

export default MobileFilterDropDown