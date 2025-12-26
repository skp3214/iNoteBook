export const formatMessage = (text) => {
    // Guard clause: if text is not a string, return empty or fallback
    if (typeof text !== 'string') {
        return <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            [Message not available]
        </div>;
    }

    const lines = text.split('\n');
    const formattedElements = [];

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        // Empty line → spacing
        if (trimmedLine === '') {
            formattedElements.push(<div key={index} style={{ height: '0.75rem' }} />);
            return;
        }

        // Bullet points: starts with "* "
        if (trimmedLine.startsWith('* ')) {
            const content = line.substring(2); // Keep original indentation if any

            const formattedContent = content.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                        <strong key={i} style={{ fontWeight: 600, color: 'var(--accent-primary, #007bff)' }}>
                            {part.slice(2, -2)}
                        </strong>
                    );
                }
                return part;
            });

            formattedElements.push(
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                    <span style={{ marginRight: '0.5rem', color: 'var(--accent-primary, #007bff)', fontWeight: 'bold', minWidth: '8px' }}>•</span>
                    <span style={{ lineHeight: '1.5' }}>{formattedContent}</span>
                </div>
            );
            return;
        }

        // Header: ends with colon and no bullets
        if (trimmedLine.endsWith(':') && !line.includes('*')) {
            formattedElements.push(
                <div key={index} style={{
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    color: 'var(--text-primary)',
                    marginBottom: '0.75rem',
                    marginTop: index > 0 ? '1rem' : '0',
                    borderBottom: '1px solid var(--border-light)',
                    paddingBottom: '0.25rem'
                }}>
                    {trimmedLine}
                </div>
            );
            return;
        }

        // Regular paragraph with bold support
        const formattedContent = line.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <strong key={i} style={{ fontWeight: 600, color: 'var(--accent-primary, #007bff)' }}>
                        {part.slice(2, -2)}
                    </strong>
                );
            }
            return part;
        });

        formattedElements.push(
            <div key={index} style={{ marginBottom: '0.5rem', lineHeight: '1.6' }}>
                {formattedContent}
            </div>
        );
    });

    return <div style={{ fontSize: '0.95rem' }}>{formattedElements}</div>;
};

export const autoResizeTextarea = (textarea) => {
        if (textarea) {
            // Store current scroll position
            const cursorPosition = textarea.selectionStart;

            // Reset height to calculate scroll height
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            const maxHeight = 120;
            const minHeight = 48;

            if (scrollHeight <= maxHeight) {
                // Content fits within max height, expand textarea
                textarea.style.height = Math.max(minHeight, scrollHeight) + 'px';
                textarea.style.overflowY = 'hidden';
            } else {
                // Content exceeds max height, set to max and enable scrolling
                textarea.style.height = maxHeight + 'px';
                textarea.style.overflowY = 'auto';

                // Auto-scroll to bottom when typing
                setTimeout(() => {
                    textarea.scrollTop = textarea.scrollHeight;
                }, 0);
            }

            // Restore cursor position
            textarea.setSelectionRange(cursorPosition, cursorPosition);
        }
    };
