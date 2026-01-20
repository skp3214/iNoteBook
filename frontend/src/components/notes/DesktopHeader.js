import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
const DesktopHeader = ({sortOrder,viewMode,toggleSortOrder,setViewMode,filteredNotes}) => {
    return (
        <><div className="d-none d-lg-flex align-items-center justify-content-between mb-4">
            <div>
                <h2
                    className="mb-1"
                    style={{
                        fontSize: '1.75rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                    }}
                >
                    Your Notes
                </h2>
                <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
                    {filteredNotes.length} notes found
                </p>
            </div>

            <div className="d-flex gap-2">
                <button
                    onClick={() => {
                        localStorage.setItem("viewmode","grid");
                        setViewMode('grid');
                    }}
                    className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: viewMode === 'grid' ? 'none' : '1px solid var(--border-light)',
                        fontSize: '1.1rem',
                    }}
                    title="Grid View"
                >
                    ▦
                </button>
                <button
                    onClick={() => {
                        localStorage.setItem("viewmode","list");
                        setViewMode('list');
                    }}
                    className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: viewMode === 'list' ? 'none' : '1px solid var(--border-light)',
                        fontSize: '1.1rem',
                    }}
                    title="List View"
                >
                    ☰
                </button>
                <button
                    onClick={toggleSortOrder}
                    className={`btn btn-sm ${sortOrder === 'priority' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: sortOrder === 'priority' ? 'none' : '1px solid var(--border-light)',
                        fontSize: '1.1rem',
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
            </div>
        </div></>
    )
}

export default DesktopHeader