import React from 'react'
import { Spinner } from 'react-bootstrap'

const LoadingSpinner = () => {
    return (
        <>
            <div className="mb-3 d-flex">
                <div style={{ maxWidth: '85%' }}>
                    <div style={{
                        background: 'var(--bg-secondary, #f8f9fa)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '1.25rem 1.25rem 1.25rem 0.25rem',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Spinner animation="grow" size="sm" className="me-1" style={{ color: 'var(--accent-primary)' }} />
                        <Spinner animation="grow" size="sm" className="me-1" style={{ color: 'var(--accent-primary)', animationDelay: '0.15s' }} />
                        <Spinner animation="grow" size="sm" className="me-2" style={{ color: 'var(--accent-primary)', animationDelay: '0.3s' }} />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            AI is thinking...
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoadingSpinner