export const formatMessage = (text) => {
    const lines = text.split('\n');
    const formattedElements = [];

    lines.forEach((line, index) => {
        // Handle bullet points
        if (line.trim().startsWith('* ')) {
            const content = line.substring(2).trim();

            // Handle bold text within bullet points (e.g., **text**)
            const formattedContent = content.split(/(\*\*[^*]+\*\*)/g).map((part, partIndex) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                        <strong key={partIndex} style={{
                            fontWeight: 600,
                            color: 'var(--accent-primary, #007bff)'
                        }}>
                            {part.slice(2, -2)}
                        </strong>
                    );
                }
                return part;
            });

            formattedElements.push(
                <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem',
                    paddingLeft: '0.5rem'
                }}>
                    <span style={{
                        marginRight: '0.5rem',
                        color: 'var(--accent-primary, #007bff)',
                        fontWeight: 'bold',
                        minWidth: '8px'
                    }}>•</span>
                    <span style={{ lineHeight: '1.5' }}>{formattedContent}</span>
                </div>
            );
        }
        // Handle headers (lines that end with colon)
        else if (line.trim().endsWith(':') && line.trim().length > 1 && !line.includes('*')) {
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
                    {line.trim()}
                </div>
            );
        }
        // Handle empty lines
        else if (line.trim() === '') {
            formattedElements.push(
                <div key={index} style={{ height: '0.75rem' }} />
            );
        }
        // Handle regular text with bold formatting
        else if (line.trim()) {
            const formattedContent = line.split(/(\*\*[^*]+\*\*)/g).map((part, partIndex) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                        <strong key={partIndex} style={{
                            fontWeight: 600,
                            color: 'var(--accent-primary, #007bff)'
                        }}>
                            {part.slice(2, -2)}
                        </strong>
                    );
                }
                return part;
            });

            formattedElements.push(
                <div key={index} style={{
                    marginBottom: '0.5rem',
                    lineHeight: '1.6'
                }}>
                    {formattedContent}
                </div>
            );
        }
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
