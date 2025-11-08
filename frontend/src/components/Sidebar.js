import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faExclamationTriangle, faUser, faStar, faCheck,faClipboardList } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ notes, filterTag, setFilterTag, showSidebar, setShowSidebar, onAddNote }) => {
  const tagConfig = [
    { name: 'All Notes', icon: <FontAwesomeIcon icon={faClipboardList} style={{color:'#8b5cf6'}} />, color: '#8b5cf6', count: notes.length },
    { name: 'Work', icon: <FontAwesomeIcon icon={faBriefcase} style={{color:'#3b82f6'}} />, color: '#3b82f6', count: notes.filter(n => n.tag === 'Work').length },
    { name: 'Urgent', icon: <FontAwesomeIcon icon={faExclamationTriangle} style={{color:'#ef4444'}} />, color: '#ef4444', count: notes.filter(n => n.tag === 'Urgent').length },
    { name: 'Personal', icon: <FontAwesomeIcon icon={faUser} style={{color:'#06b6d4'}} />, color: '#06b6d4', count: notes.filter(n => n.tag === 'Personal').length },
    { name: 'Important', icon: <FontAwesomeIcon icon={faStar} style={{color:'#f59e0b'}} />, color: '#f59e0b', count: notes.filter(n => n.tag === 'Important').length },
    { name: 'Completed', icon: <FontAwesomeIcon icon={faCheck} style={{color:'#10b981'}} />, color: '#10b981', count: notes.filter(n => n.tag === 'Completed').length },
  ];

  const handleTagClick = (tagName) => {
    if (tagName === 'All Notes') {
      setFilterTag('');
    } else {
      setFilterTag(tagName);
    }
    // Close sidebar on mobile after selection
    if (window.innerWidth < 992) {
      setShowSidebar(false);
    }
  };

  const isActive = (tagName) => {
    return (tagName === 'All Notes' && !filterTag) || (tagName === filterTag);
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`sidebar ${showSidebar ? 'show' : ''} d-lg-block`}
        style={{
          position: 'fixed',
          top: '80px',
          left: window.innerWidth >= 992 ? '0' : (showSidebar ? '0' : '-320px'),
          width: window.innerWidth >= 992 ? '24%' : '280px',
          maxWidth: '320px',
          minWidth: '240px',
          height: 'calc(100vh - 80px)',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-light)',
          padding: '1.5rem 1rem',
          overflowY: 'auto',
          transition: 'left 0.3s ease',
          zIndex: 1041,
        }}
      >
        {/* New Note Button */}
        <Button
          onClick={onAddNote}
          className="w-100 mb-4 d-flex align-items-center justify-content-center"
          style={{
            background: 'linear-gradient(135deg, #00bf8f 0%, #001510 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '0.875rem 1rem',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'white',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
          }}
        >
          <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>+</span>
          New Note
        </Button>

        <div className="mb-4">
          <h6
            className="text-uppercase mb-3"
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: 'var(--text-primary)',
              paddingLeft: '0.75rem',
            }}
          >
            Tags
          </h6>

          <div className="d-flex flex-column gap-2">
            {tagConfig.map((tag) => (
              <button
                key={tag.name}
                onClick={() => handleTagClick(tag.name)}
                className={`sidebar-tag-item ${isActive(tag.name) ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: isActive(tag.name)
                    ? 'var(--bg-elevated)'
                    : 'transparent',
                  color: 'var(--text-primary)',
                  fontWeight: isActive(tag.name) ? 600 : 500,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive(tag.name) ? 'var(--shadow-sm)' : 'none',
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <span style={{ fontSize: '1.25rem' }}>{tag.icon}</span>
                  <span>{tag.name}</span>
                </div>
                <Badge
                  bg="secondary"
                  pill
                  style={{
                    background: isActive(tag.name)
                      ? tag.color
                      : 'var(--bg-tertiary)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    padding: '0.35rem 0.65rem',
                  }}
                >
                  {tag.count}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-light)' }}>
          <h6
            className="text-uppercase mb-3"
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: 'var(--text-primary)',
              paddingLeft: '0.75rem',
            }}
          >
            Recent Activity
          </h6>
          <div className="d-flex flex-column gap-2">
            {notes.slice(0, 3).map((note, idx) => (
              <div
                key={idx}
                className="p-2"
                style={{
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <div className="d-flex align-items-start gap-2">
                  <span><FontAwesomeIcon icon={faClipboardList} /></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        color: 'var(--text-primary)',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {note.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {new Date(note.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop static sidebar */}
      <style>
        {`
          @media (min-width: 992px) {
            .sidebar {
              position: sticky !important;
              top: 80px !important;
              left: 0 !important;
              height: calc(100vh - 80px) !important;
            }
          }

          .sidebar-tag-item:hover {
            background: var(--bg-elevated) !important;
          }

          .sidebar::-webkit-scrollbar {
            width: 6px;
          }

          .sidebar::-webkit-scrollbar-track {
            background: transparent;
          }

          .sidebar::-webkit-scrollbar-thumb {
            background: var(--border-medium);
            border-radius: 3px;
          }

          .sidebar::-webkit-scrollbar-thumb:hover {
            background: var(--text-muted);
          }
        `}
      </style>
    </>
  );
};

export default Sidebar;
