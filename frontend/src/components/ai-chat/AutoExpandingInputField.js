import { faMicrophone, faMicrophoneSlash, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Button, Form } from 'react-bootstrap';

const AutoExpandingInputField = ({ inputRef, isLoading, inputMessage,
    setInputMessage, autoResizeTextarea,
    sendMessage, speechSupported, isListening, stopListening, startListening }) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    return (
        <>

            <div className="d-flex align-items-end gap-2">
                {/* Voice Input Button */}
                {speechSupported && (
                    <Button
                        variant={isListening ? "danger" : "outline-secondary"}
                        onClick={isListening ? stopListening : startListening}
                        disabled={isLoading}
                        style={{
                            border: 'none',
                            borderRadius: '50%',
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isListening ? 'var(--danger)' : 'var(--bg-tertiary)',
                            flexShrink: 0
                        }}
                        title={isListening ? "Stop recording" : "Voice input"}
                    >
                        <FontAwesomeIcon
                            icon={isListening ? faMicrophoneSlash : faMicrophone}
                            style={{
                                fontSize: '1.1rem',
                                color: isListening ? 'white' : 'var(--text-muted)'
                            }}
                        />
                    </Button>
                )}

                <div className="position-relative flex-grow-1">
                    <Form.Control
                        as="textarea"
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => {
                            setInputMessage(e.target.value);
                            // Auto-resize textarea up to max height, then allow scrolling
                            autoResizeTextarea(e.target);
                        }}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask, note, or create ..."
                        disabled={isLoading}
                        rows={1}
                        className="custom-scrollbar"
                        style={{
                            resize: 'none',
                            borderRadius: '25px',
                            paddingLeft: '1.25rem',
                            paddingRight: '3.5rem',
                            paddingTop: '0.875rem',
                            paddingBottom: '0.875rem',
                            fontSize: '1rem',
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-light)',
                            color: 'var(--text-primary)',
                            maxHeight: '120px',
                            minHeight: '48px',
                            lineHeight: '1.4',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            transition: 'height 0.1s ease, box-shadow 0.2s ease',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent'
                        }}
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={isLoading || !inputMessage.trim()}
                        style={{
                            position: 'absolute',
                            right: '8px',
                            bottom: '4px',
                            zIndex: 5,
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            background: inputMessage.trim() && !isLoading ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'var(--bg-tertiary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faPaperPlane}
                            style={{
                                fontSize: '1rem',
                                color: inputMessage.trim() && !isLoading ? 'white' : 'var(--text-muted)'
                            }}
                        />
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AutoExpandingInputField