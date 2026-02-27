import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
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
    clearSyncedOfflineNotes,
    migrateOldOfflineData,
    saveCachedNotes,
    getCachedNotes,
    updateCachedNote,
    removeCachedNote,
    cleanupPendingActions,
    removeOfflineNoteByContent
} from '../../utils/offlineUtils';
import { authenticatedFetch, handleAuthResponse } from '../../utils/authUtils';

const NoteState = (props) => {
    const host = process.env.REACT_APP_API_BASE_URL;
    const notesInitial = [];
    const navigate = useNavigate();

    const [note, setNotes] = useState(notesInitial);
    const [isOnline, setIsOnline] = useState(true);
    const [syncInProgress, setSyncInProgress] = useState(false);
    const syncRef = useRef(false);

    // Migrate old localStorage data on mount
    useEffect(() => {
        migrateOldOfflineData();
    }, []);

    // Sync pending actions when back online
    const syncPendingActions = useCallback(async () => {
        if (!isOnline || syncRef.current) return;

        syncRef.current = true;
        setSyncInProgress(true);
        const pendingActions = getPendingActions();

        for (const action of pendingActions) {
            try {
                let response;
                let authResult;

                switch (action.type) {
                    case 'ADD_NOTE':
                        response = await authenticatedFetch(`${host}/api/notes/addnotes`, {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json',
                                'authtoken': localStorage.getItem('token')
                            },
                            body: JSON.stringify(action.data)
                        }, navigate);

                        authResult = await handleAuthResponse(response, navigate);
                        if (!authResult.isValid) {
                            syncRef.current = false;
                            setSyncInProgress(false);
                            return;
                        }

                        if (response.ok) {
                            removeOfflineNoteByContent(action.data.title, action.data.description, action.data.tag);
                        }
                        break;

                    case 'UPDATE_NOTE':
                        response = await authenticatedFetch(`${host}/api/notes/updatenotes/${action.data.id}`, {
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
                        }, navigate);

                        authResult = await handleAuthResponse(response, navigate);
                        if (!authResult.isValid) {
                            syncRef.current = false;
                            setSyncInProgress(false);
                            return;
                        }
                        break;

                    case 'DELETE_NOTE':
                        response = await authenticatedFetch(`${host}/api/notes/deletenotes/${action.data.id}`, {
                            method: "DELETE",
                            headers: {
                                'Content-Type': 'application/json',
                                'authtoken': localStorage.getItem('token')
                            }
                        }, navigate);

                        authResult = await handleAuthResponse(response, navigate);
                        if (!authResult.isValid) {
                            syncRef.current = false;
                            setSyncInProgress(false);
                            return;
                        }
                        break;

                    default:
                        break;
                }
                removePendingAction(action.id);
            } catch (error) {
                console.error('Failed to sync action:', action, error);
                break; // Stop syncing on error
            }
        }

        // Refresh notes after sync
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await authenticatedFetch(`${host}/api/notes/fetchallnotes`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'authtoken': token
                    },
                }, navigate);

                const authResult = await handleAuthResponse(response, navigate);
                if (!authResult.isValid) {
                    syncRef.current = false;
                    setSyncInProgress(false);
                    return;
                }

                if (response.ok) {
                    const onlineNotes = authResult.data;
                    const offlineNotes = getOfflineNotes();
                    const mergedNotes = mergeNotes(onlineNotes, offlineNotes);
                    setNotes(mergedNotes);

                    saveCachedNotes(onlineNotes);
                    cleanupPendingActions(onlineNotes);
                    clearSyncedOfflineNotes(onlineNotes);
                }
            }
        } catch (error) {
            console.error('Error refreshing notes after sync:', error);
        }

        setSyncInProgress(false);
        syncRef.current = false;
    }, [host, isOnline, navigate]);

    // Network status management
    useEffect(() => {
        const updateNetworkStatus = (online) => {
            setIsOnline(online);
            if (online && !syncRef.current) {
                syncPendingActions();
            }
        };

        updateNetworkStatus(navigator.onLine);

        const handleOnline = () => updateNetworkStatus(true);
        const handleOffline = () => updateNetworkStatus(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

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
    }, [syncPendingActions]);

    const getNotes = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setNotes([]);
            return;
        }

        const offlineNotes = getOfflineNotes();
        const cachedNotes = getCachedNotes();
        const instantNotes = mergeNotes(cachedNotes, offlineNotes);
        setNotes(instantNotes); 

        if (isOnline) {
            try {
                const response = await authenticatedFetch(`${host}/api/notes/fetchallnotes`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'authtoken': token
                    },
                }, navigate);

                const authResult = await handleAuthResponse(response, navigate);
                if (!authResult.isValid) {
                    return;
                }

                if (response.ok) {
                    const onlineNotes = authResult.data;

                    const mergedNotes = mergeNotes(onlineNotes, offlineNotes);

                    setNotes(prev => {
                        if (JSON.stringify(prev) === JSON.stringify(mergedNotes)) {
                            return prev;
                        }
                        return mergedNotes;
                    });

                    saveCachedNotes(onlineNotes);
                    cleanupPendingActions(onlineNotes);
                }
            } catch (error) {
                console.error('Background fetch failed (offline mode):', error);
            }
        }
    }, [host, isOnline, navigate]);
    const addNote = async (title, description, tag) => {
        const noteData = { title, description, tag };

        try {
            if (isOnline) {
                const response = await authenticatedFetch(`${host}/api/notes/addnotes`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'authtoken': localStorage.getItem('token')
                    },
                    body: JSON.stringify(noteData)
                }, navigate);

                const authResult = await handleAuthResponse(response, navigate);
                if (!authResult.isValid) return;

                if (response.ok) {
                    const newNote = authResult.data;
                    setNotes(prevNotes => [...prevNotes, newNote]);
                    return;
                }
            }
        } catch (error) {
            console.error('Error adding note online:', error);
        }

        // Offline fallback
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
                const response = await authenticatedFetch(`${host}/api/notes/deletenotes/${id}`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'authtoken': localStorage.getItem('token')
                    }
                }, navigate);

                const authResult = await handleAuthResponse(response, navigate);
                if (!authResult.isValid) return;

                if (response.ok) {
                    setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
                    return;
                }
            }
        } catch (error) {
            console.error('Error deleting note online:', error);
        }

        // Offline handling
        deleteOfflineNote(id);
        setNotes(prevNotes => prevNotes.filter(note => note._id !== id));

        if (!id.startsWith('offline_')) {
            removeCachedNote(id);
            addPendingAction({
                type: 'DELETE_NOTE',
                data: { id }
            });
        }
    };

    const editNote = async (id, title, description, tag) => {
        const updateData = { title, description, tag };

        try {
            if (isOnline && !id.startsWith('offline_')) {
                const response = await authenticatedFetch(`${host}/api/notes/updatenotes/${id}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        'authtoken': localStorage.getItem('token')
                    },
                    body: JSON.stringify(updateData)
                }, navigate);

                const authResult = await handleAuthResponse(response, navigate);
                if (!authResult.isValid) return;

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

        // Offline update
        updateOfflineNote(id, updateData);
        setNotes(prevNotes => prevNotes.map(note =>
            note._id === id ? { ...note, ...updateData, isOffline: true } : note
        ));

        if (!id.startsWith('offline_')) {
            updateCachedNote(id, updateData);
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