// Offline storage utilities for iNotebook

// Keys for localStorage
const OFFLINE_NOTES_KEY = 'inotebook_offline_notes';
const PENDING_ACTIONS_KEY = 'inotebook_pending_actions';
const NETWORK_STATUS_KEY = 'inotebook_network_status';

// Get offline notes from localStorage
export const getOfflineNotes = () => {
  try {
    const notes = localStorage.getItem(OFFLINE_NOTES_KEY);
    return notes ? JSON.parse(notes) : [];
  } catch (error) {
    console.error('Error getting offline notes:', error);
    return [];
  }
};

// Save notes to localStorage
export const saveOfflineNotes = (notes) => {
  try {
    localStorage.setItem(OFFLINE_NOTES_KEY, JSON.stringify(notes));
    return true;
  } catch (error) {
    console.error('Error saving offline notes:', error);
    return false;
  }
};

// Add a note to offline storage
export const addOfflineNote = (note) => {
  try {
    const notes = getOfflineNotes();
    const newNote = {
      ...note,
      _id: `offline_${Date.now()}_${Math.random()}`,
      isOffline: true,
      createdAt: new Date().toISOString()
    };
    notes.push(newNote);
    saveOfflineNotes(notes);
    return newNote;
  } catch (error) {
    console.error('Error adding offline note:', error);
    return null;
  }
};

// Update a note in offline storage
export const updateOfflineNote = (id, updatedNote) => {
  try {
    const notes = getOfflineNotes();
    const noteIndex = notes.findIndex(note => note._id === id);
    if (noteIndex !== -1) {
      notes[noteIndex] = { ...notes[noteIndex], ...updatedNote, isOffline: true };
      saveOfflineNotes(notes);
      return notes[noteIndex];
    }
    return null;
  } catch (error) {
    console.error('Error updating offline note:', error);
    return null;
  }
};

// Delete a note from offline storage
export const deleteOfflineNote = (id) => {
  try {
    const notes = getOfflineNotes();
    const filteredNotes = notes.filter(note => note._id !== id);
    saveOfflineNotes(filteredNotes);
    return true;
  } catch (error) {
    console.error('Error deleting offline note:', error);
    return false;
  }
};

// Pending actions management
export const getPendingActions = () => {
  try {
    const actions = localStorage.getItem(PENDING_ACTIONS_KEY);
    return actions ? JSON.parse(actions) : [];
  } catch (error) {
    console.error('Error getting pending actions:', error);
    return [];
  }
};

export const addPendingAction = (action) => {
  try {
    const actions = getPendingActions();
    const newAction = {
      ...action,
      id: `action_${Date.now()}_${Math.random()}`,
      timestamp: new Date().toISOString()
    };
    actions.push(newAction);
    localStorage.setItem(PENDING_ACTIONS_KEY, JSON.stringify(actions));
    return newAction;
  } catch (error) {
    console.error('Error adding pending action:', error);
    return null;
  }
};

export const removePendingAction = (actionId) => {
  try {
    const actions = getPendingActions();
    const filteredActions = actions.filter(action => action.id !== actionId);
    localStorage.setItem(PENDING_ACTIONS_KEY, JSON.stringify(filteredActions));
    return true;
  } catch (error) {
    console.error('Error removing pending action:', error);
    return false;
  }
};

export const clearPendingActions = () => {
  try {
    localStorage.removeItem(PENDING_ACTIONS_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing pending actions:', error);
    return false;
  }
};

// Network status management
export const getNetworkStatus = () => {
  try {
    const status = localStorage.getItem(NETWORK_STATUS_KEY);
    return status ? JSON.parse(status) : { isOnline: navigator.onLine, lastChecked: Date.now() };
  } catch (error) {
    console.error('Error getting network status:', error);
    return { isOnline: navigator.onLine, lastChecked: Date.now() };
  }
};

export const setNetworkStatus = (isOnline) => {
  try {
    const status = {
      isOnline,
      lastChecked: Date.now()
    };
    localStorage.setItem(NETWORK_STATUS_KEY, JSON.stringify(status));
    return status;
  } catch (error) {
    console.error('Error setting network status:', error);
    return null;
  }
};

// Clear all offline data
export const clearOfflineData = () => {
  try {
    localStorage.removeItem(OFFLINE_NOTES_KEY);
    localStorage.removeItem(PENDING_ACTIONS_KEY);
    localStorage.removeItem(NETWORK_STATUS_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing offline data:', error);
    return false;
  }
};

// Merge online and offline notes (removing duplicates)
export const mergeNotes = (onlineNotes, offlineNotes) => {
  try {
    const mergedNotes = [...onlineNotes];
    
    offlineNotes.forEach(offlineNote => {
      // Only add offline notes that don't have corresponding online versions
      const existsOnline = onlineNotes.some(onlineNote => 
        onlineNote._id === offlineNote._id || 
        (onlineNote.title === offlineNote.title && 
         onlineNote.description === offlineNote.description)
      );
      
      if (!existsOnline) {
        mergedNotes.push(offlineNote);
      }
    });
    
    return mergedNotes;
  } catch (error) {
    console.error('Error merging notes:', error);
    return onlineNotes;
  }
};

// Check if we're in a PWA environment
export const isPWA = () => {
  return window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
};

// Check network connectivity
export const checkNetworkConnectivity = async () => {
  try {
    const response = await fetch('/api/health', {
      method: 'HEAD',
      cache: 'no-cache'
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};
