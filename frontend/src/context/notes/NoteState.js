import React, { useState, useCallback, useEffect } from "react";
import noteContext from "./noteContext";
import {
    getOfflineNotes,
    addOfflineNote,
    updateOfflineNote,
    deleteOfflineNote,
    getPendingActions,
    addPendingAction,
    removePendingAction,
    mergeNotes,
    setNetworkStatus
} from '../../utils/offlineUtils';

const NoteState = (props) => {
    const host = process.env.REACT_APP_API_BASE_URL;
    const notesInitial = [];

    const [note, setNotes] = useState(notesInitial);
    const [isOnline, setIsOnline] = useState(true);
    const [syncInProgress, setSyncInProgress] = useState(false);

    // Sync pending actions when back online
    const syncPendingActions = useCallback(async () => {
        if (!isOnline || syncInProgress) return;

        setSyncInProgress(true);
        const pendingActions = getPendingActions();

        for (const action of pendingActions) {
            try {
                switch (action.type) {
                    case 'ADD_NOTE':
                        await fetch(`${host}/api/notes/addnotes`, {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json',
                                'authtoken': localStorage.getItem('token')
                            },
                            body: JSON.stringify(action.data)
                        });
                        break;
                    case 'UPDATE_NOTE':
                        await fetch(`${host}/api/notes/updatenotes/${action.data.id}`, {
                            method: "PUT",
                            headers: {
                                'Content-Type': 'application/json',
                                'authtoken': localStorage.getItem('token')
                            },
                            body: JSON.stringify({
                                title: action.data.title,
                                description: action.data.description,
                                tag: action.data.tag
                            })
                        });
                        break;
                    case 'DELETE_NOTE':
                        await fetch(`${host}/api/notes/deletenotes/${action.data.id}`, {
                            method: "DELETE",
                            headers: {
                                'Content-Type': 'application/json',
                                'authtoken': localStorage.getItem('token')
                            }
                        });
                        break;
                    default:
                        break;
                }
                removePendingAction(action.id);
            } catch (error) {
                console.error('Failed to sync action:', action, error);
                break; // Stop syncing if one fails
            }
        }

        // Refresh notes after sync
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await fetch(`${host}/api/notes/fetchallnotes`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'authtoken': token
                    },
                });
                
                if (response.ok) {
                    let onlineNotes = await response.json();
                    const offlineNotes = getOfflineNotes();
                    const mergedNotes = mergeNotes(onlineNotes, offlineNotes);
                    setNotes(mergedNotes);
                }
            }
        } catch (error) {
            console.error('Error refreshing notes after sync:', error);
        }
        
        setSyncInProgress(false);
    }, [host, isOnline, syncInProgress]);

    // Network status management
    useEffect(() => {
        const updateNetworkStatus = (online) => {
            setIsOnline(online);
            setNetworkStatus(online);
            if (online && !syncInProgress) {
                syncPendingActions();
            }
        };

        // Initial network status
        updateNetworkStatus(navigator.onLine);

        // Listen for network status changes
        const handleOnline = () => updateNetworkStatus(true);
        const handleOffline = () => updateNetworkStatus(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Listen for service worker messages
        const handleMessage = (event) => {
            if (event.data && event.data.type === 'NETWORK_STATUS_UPDATE') {
                updateNetworkStatus(event.data.isOnline);
            }
        };

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', handleMessage);
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.removeEventListener('message', handleMessage);
            }
        };
    }, [syncInProgress, syncPendingActions]);

    const getNotes = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setNotes([]);
            return;
        }

        try {
            if (isOnline) {
                const response = await fetch(`${host}/api/notes/fetchallnotes`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'authtoken': token
                    },
                });
                
                if (response.ok) {
                    let onlineNotes = await response.json();
                    const offlineNotes = getOfflineNotes();
                    const mergedNotes = mergeNotes(onlineNotes, offlineNotes);
                    setNotes(mergedNotes);
                    return;
                }
            }
        } catch (error) {
            console.error('Error fetching online notes:', error);
        }

        // Fallback to offline notes
        const offlineNotes = getOfflineNotes();
        setNotes(offlineNotes);
    }, [host, isOnline]);

    const addNote = async (title, description, tag) => {
        const noteData = { title, description, tag };

        try {
            if (isOnline) {
                const response = await fetch(`${host}/api/notes/addnotes`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'authtoken': localStorage.getItem('token')
                    },
                    body: JSON.stringify(noteData)
                });

                if (response.ok) {
                    const newNote = await response.json();
                    setNotes(prevNotes => [...prevNotes, newNote]);
                    return;
                }
            }
        } catch (error) {
            console.error('Error adding note online:', error);
        }

        // Fallback to offline mode
        const offlineNote = addOfflineNote(noteData);
        if (offlineNote) {
            setNotes(prevNotes => [...prevNotes, offlineNote]);
            addPendingAction({
                type: 'ADD_NOTE',
                data: noteData
            });
        }
    };

    const deleteNote = async (id) => {
        try {
            if (isOnline && !id.startsWith('offline_')) {
                const response = await fetch(`${host}/api/notes/deletenotes/${id}`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'authtoken': localStorage.getItem('token')
                    }
                });

                if (response.ok) {
                    setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
                    return;
                }
            }
        } catch (error) {
            console.error('Error deleting note online:', error);
        }

        // Handle offline deletion
        deleteOfflineNote(id);
        setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
        
        if (!id.startsWith('offline_')) {
            addPendingAction({
                type: 'DELETE_NOTE',
                data: { id }
            });
        }
    };

    const restoreNote = (noteToRestore) => {
        // Add the note back to the array
        setNotes(prevNotes => [...prevNotes, noteToRestore]);
        
        // If it was an online note, remove the pending delete action
        if (!noteToRestore._id.startsWith('offline_')) {
            const pendingActions = getPendingActions();
            const deleteAction = pendingActions.find(
                action => action.type === 'DELETE_NOTE' && action.data.id === noteToRestore._id
            );
            if (deleteAction) {
                removePendingAction(deleteAction.id);
            }
        } else {
            // For offline notes, restore to local storage
            const offlineNote = {
                title: noteToRestore.title,
                description: noteToRestore.description,
                tag: noteToRestore.tag
            };
            addOfflineNote(offlineNote);
        }
    };

    const editNote = async (id, title, description, tag) => {
        const updateData = { title, description, tag };

        try {
            if (isOnline && !id.startsWith('offline_')) {
                const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        'authtoken': localStorage.getItem('token')
                    },
                    body: JSON.stringify(updateData)
                });

                if (response.ok) {
                    setNotes(prevNotes => prevNotes.map(note => 
                        note._id === id ? { ...note, ...updateData } : note
                    ));
                    return;
                }
            }
        } catch (error) {
            console.error('Error updating note online:', error);
        }

        // Handle offline update
        updateOfflineNote(id, updateData);
        setNotes(prevNotes => prevNotes.map(note => 
            note._id === id ? { ...note, ...updateData, isOffline: true } : note
        ));

        if (!id.startsWith('offline_')) {
            addPendingAction({
                type: 'UPDATE_NOTE',
                data: { id, ...updateData }
            });
        }
    };

    return (
        <noteContext.Provider value={{ 
            note, 
            addNote, 
            deleteNote, 
            restoreNote,
            editNote, 
            getNotes, 
            isOnline, 
            syncInProgress 
        }}>
            {props.children}
        </noteContext.Provider>
    );
};

export default NoteState;
