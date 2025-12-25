import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Form } from 'react-bootstrap';

const SearchBar = ({externalSetSearchQuery,setSearchQuery,setShowDropdown,showDropdown,activeSearchQuery}) => {
    return (
        <>
            <div className="mb-4 d-lg-none">
                <div className="position-relative">
                    <Form.Control
                        type="text"
                        placeholder="Search notes..."
                        value={activeSearchQuery || ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (externalSetSearchQuery) {
                                externalSetSearchQuery(value);
                            } else {
                                setSearchQuery(value);
                            }
                        }}
                        className="search-input"
                        style={{
                            paddingLeft: '2.5rem',
                            paddingRight: '3.5rem',
                            height: '38px',
                            fontSize: '1rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-light)',
                            borderRadius: '10px',
                            color: 'var(--text-primary)',
                        }}
                    />
                    {/* Filter Icon - Mobile */}
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="btn btn-link position-absolute filter-toggle-btn"
                        style={{
                            right: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-primary)',
                            textDecoration: 'none',
                            zIndex: 5,
                            fontSize: '1.25rem',
                        }}
                        title="Filter"
                    >
                        <FontAwesomeIcon
                            icon={faFilter}
                            style={{
                                fontSize: '14px',
                                cursor: 'pointer'
                            }} />
                    </button>
                </div>
            </div>
        </>
    )
}

export default SearchBar