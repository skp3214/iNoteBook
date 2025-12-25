import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
const MobileHeader = ({
    sortOrder,
    openAddModal,
    viewMode,
    setViewMode,
    filteredNotes,
    toggleSortOrder
}) => {
    return (
        <>
            <div className="d-lg-none d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-3">
                    <div>
                        <h2
                            className="mb-1"
                            style={{
                                fontSize: '1.1rem',
                                fontWeight: 500,
                                color: 'var(--text-primary)',
                            }}
                        >
                            Your Notes
                        </h2>
                        <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
                            {filteredNotes.length} notes found
                        </p>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                    {/* View Toggle + Sort + Add Button - Mobile */}
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: viewMode === 'grid' ? 'none' : '1px solid var(--border-light)',
                        }}
                        title="Grid View"
                    >
                        ▦
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: viewMode === 'list' ? 'none' : '1px solid var(--border-light)',
                        }}
                        title="List View"
                    >
                        ☰
                    </button>
                    <button
                        onClick={toggleSortOrder}
                        className={`btn btn-sm ${sortOrder === 'priority' ? 'btn-primary' : 'btn-black'}`}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: sortOrder === 'priority' ? 'none' : '1px solid var(--border-light)',
                            fontSize: '1rem',
                        }}
                        title={sortOrder === 'priority' ? 'Sort by Date' : 'Sort by Priority'}
                    >
                        <FontAwesomeIcon
                            icon={faSort}
                            style={{
                                fontSize: '14px',
                                cursor: 'pointer'
                            }} />
                    </button>
                    {/* Add Note Button - Mobile */}
                    <button
                        onClick={openAddModal}
                        className="btn btn-primary"
                        style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #00bf8f 0%, #001510 100%)',
                            border: 'none',
                            fontSize: '1.5rem',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                        }}
                        title="Add Note"
                    >
                        +
                    </button>
                </div>
            </div>
        </>
    )
}

export default MobileHeader