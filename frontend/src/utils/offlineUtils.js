// Offline storage utilities for iNotebook

// Get user-specific keys for localStorage
const getUserSpecificKey = (baseKey) => {
  const token = localStorage.getItem('token');
  if (!token) return baseKey; // Fallback for when no user is logged in
  
  // Extract user info from token (basic decode without verification)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.user?.id || 'anonymous';
    return `${baseKey}_${userId}`;
  } catch (error) {
    return baseKey; // Fallback if token parsing fails
  }
};

// Keys for localStorage
const getOfflineNotesKey = () => getUserSpecificKey('inotebook_offline_notes');
const getPendingActionsKey = () => getUserSpecificKey('inotebook_pending_actions');
const getNetworkStatusKey = () => getUserSpecificKey('inotebook_network_status');
const getCachedNotesKey = () => getUserSpecificKey('inotebook_cached_notes');

// Get offline notes from localStorage
export const getOfflineNotes = () => {
  try {
    const notes = localStorage.getItem(getOfflineNotesKey());
    return notes ? JSON.parse(notes) : [];
  } catch (error) {
    console.error('Error getting offline notes:', error);
    return [];
  }
};

// Save notes to localStorage
export const saveOfflineNotes = (notes) => {
  try {
    localStorage.setItem(getOfflineNotesKey(), JSON.stringify(notes));
    return true;
  } catch (error) {
    console.error('Error saving offline notes:', error);
    return false;
  }
};

// Get cached online notes from localStorage (for offline viewing)
export const getCachedNotes = () => {
  try {
    const notes = localStorage.getItem(getCachedNotesKey());
    return notes ? JSON.parse(notes) : [];
  } catch (error) {
    console.error('Error getting cached notes:', error);
    return [];
  }
};

// Save cached online notes to localStorage (for offline viewing)
export const saveCachedNotes = (notes) => {
  try {
    localStorage.setItem(getCachedNotesKey(), JSON.stringify(notes));
    return true;
  } catch (error) {
    console.error('Error saving cached notes:', error);
    return false;
  }
};

// Update cached note (for offline edits)
export const updateCachedNote = (id, updatedData) => {
  try {
    const cachedNotes = getCachedNotes();
    const noteIndex = cachedNotes.findIndex(note => note._id === id);
    if (noteIndex !== -1) {
      cachedNotes[noteIndex] = { ...cachedNotes[noteIndex], ...updatedData };
      saveCachedNotes(cachedNotes);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating cached note:', error);
    return false;
  }
};

// Remove note from cache (for offline deletes)
export const removeCachedNote = (id) => {
  try {
    const cachedNotes = getCachedNotes();
    const filteredNotes = cachedNotes.filter(note => note._id !== id);
    saveCachedNotes(filteredNotes);
    return true;
  } catch (error) {
    console.error('Error removing cached note:', error);
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
    const actions = localStorage.getItem(getPendingActionsKey());
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
    localStorage.setItem(getPendingActionsKey(), JSON.stringify(actions));
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
    localStorage.setItem(getPendingActionsKey(), JSON.stringify(filteredActions));
    return true;
  } catch (error) {
    console.error('Error removing pending action:', error);
    return false;
  }
};

export const clearPendingActions = () => {
  try {
    localStorage.removeItem(getPendingActionsKey());
    return true;
  } catch (error) {
    console.error('Error clearing pending actions:', error);
    return false;
  }
};

// Network status management
export const getNetworkStatus = () => {
  try {
    const status = localStorage.getItem(getNetworkStatusKey());
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
    localStorage.setItem(getNetworkStatusKey(), JSON.stringify(status));
    return status;
  } catch (error) {
    console.error('Error setting network status:', error);
    return null;
  }
};

// Clear all offline data
export const clearOfflineData = () => {
  try {
    localStorage.removeItem(getOfflineNotesKey());
    localStorage.removeItem(getPendingActionsKey());
    localStorage.removeItem(getNetworkStatusKey());
    localStorage.removeItem(getCachedNotesKey());
    return true;
  } catch (error) {
    console.error('Error clearing offline data:', error);
    return false;
  }
};

// Merge online and offline notes (removing duplicates and handling pending deletes)
export const mergeNotes = (onlineNotes, offlineNotes) => {
  try {
    // Get pending delete actions to exclude deleted notes
    const pendingActions = getPendingActions();
    const pendingDeletes = pendingActions
      .filter(action => action.type === 'DELETE_NOTE')
      .map(action => action.data.id);
    
    // Start with online notes, but exclude those pending deletion
    const mergedNotes = onlineNotes.filter(note => 
      !pendingDeletes.includes(note._id)
    );
    
    offlineNotes.forEach(offlineNote => {
      // Skip if this note is pending deletion
      if (pendingDeletes.includes(offlineNote._id)) {
        return;
      }
      
      // Only add offline notes that don't have corresponding online versions
      const existsOnline = onlineNotes.some(onlineNote => 
        onlineNote._id === offlineNote._id || 
        (onlineNote.title === offlineNote.title && 
         onlineNote.description === offlineNote.description &&
         onlineNote.tag === offlineNote.tag)
      );
      
      // Only include offline notes that haven't been synced yet
      if (!existsOnline && offlineNote._id && offlineNote._id.startsWith('offline_')) {
        mergedNotes.push(offlineNote);
      }
    });
    
    return mergedNotes;
  } catch (error) {
    console.error('Error merging notes:', error);
    return onlineNotes;
  }
};

// Clear synced offline notes after successful sync
export const clearSyncedOfflineNotes = (currentOnlineNotes) => {
  try {
    const offlineNotes = getOfflineNotes();
    
    // Keep only offline notes that don't have a corresponding online version
    const unsyncedNotes = offlineNotes.filter(offlineNote => {
      // Always keep notes that still have offline_ prefix AND no online equivalent
      if (offlineNote._id && offlineNote._id.startsWith('offline_')) {
        // Check if this offline note has been synced (exists online with same content)
        const existsOnline = currentOnlineNotes.some(onlineNote => 
          (onlineNote.title === offlineNote.title && 
           onlineNote.description === offlineNote.description &&
           onlineNote.tag === offlineNote.tag)
        );
        
        // Keep only if it doesn't exist online (hasn't been synced yet)
        return !existsOnline;
      }
      
      // Remove any offline notes that don't have offline_ prefix (these are corrupted)
      return false;
    });
    
    saveOfflineNotes(unsyncedNotes);
    return true;
  } catch (error) {
    console.error('Error clearing synced offline notes:', error);
    return false;
  }
};

// Clean up pending actions that are no longer valid after sync
export const cleanupPendingActions = (currentOnlineNotes) => {
  try {
    const pendingActions = getPendingActions();
    const onlineNoteIds = currentOnlineNotes.map(note => note._id);
    
    // Filter out pending delete actions for notes that are already deleted
    const validActions = pendingActions.filter(action => {
      if (action.type === 'DELETE_NOTE') {
        // Keep delete action only if note still exists online
        return onlineNoteIds.includes(action.data.id);
      }
      if (action.type === 'UPDATE_NOTE') {
        // Keep update action only if note still exists online
        return onlineNoteIds.includes(action.data.id);
      }
      // Keep add actions as they are
      return true;
    });
    
    localStorage.setItem(getPendingActionsKey(), JSON.stringify(validActions));
    return true;
  } catch (error) {
    console.error('Error cleaning up pending actions:', error);
    return false;
  }
};

// Remove specific offline note after successful sync
export const removeOfflineNoteByContent = (title, description, tag) => {
  try {
    const offlineNotes = getOfflineNotes();
    const filteredNotes = offlineNotes.filter(note => 
      !(note.title === title && note.description === description && note.tag === tag)
    );
    saveOfflineNotes(filteredNotes);
    return true;
  } catch (error) {
    console.error('Error removing synced offline note:', error);
    return false;
  }
};

// Migrate old global localStorage data to user-specific format
export const migrateOldOfflineData = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return; // No user logged in
    
    // Check if old global data exists and user-specific data doesn't
    const oldNotes = localStorage.getItem('inotebook_offline_notes');
    const oldActions = localStorage.getItem('inotebook_pending_actions');
    const oldNetworkStatus = localStorage.getItem('inotebook_network_status');
    const oldCachedNotes = localStorage.getItem('inotebook_cached_notes');
    
    const userNotesKey = getOfflineNotesKey();
    const userActionsKey = getPendingActionsKey();
    const userNetworkKey = getNetworkStatusKey();
    const userCachedKey = getCachedNotesKey();
    
    // Migrate notes
    if (oldNotes && !localStorage.getItem(userNotesKey)) {
      localStorage.setItem(userNotesKey, oldNotes);
      localStorage.removeItem('inotebook_offline_notes');
    }
    
    // Migrate pending actions
    if (oldActions && !localStorage.getItem(userActionsKey)) {
      localStorage.setItem(userActionsKey, oldActions);
      localStorage.removeItem('inotebook_pending_actions');
    }
    
    // Migrate network status
    if (oldNetworkStatus && !localStorage.getItem(userNetworkKey)) {
      localStorage.setItem(userNetworkKey, oldNetworkStatus);
      localStorage.removeItem('inotebook_network_status');
    }
    
    // Migrate cached notes
    if (oldCachedNotes && !localStorage.getItem(userCachedKey)) {
      localStorage.setItem(userCachedKey, oldCachedNotes);
      localStorage.removeItem('inotebook_cached_notes');
    }
    
    return true;
  } catch (error) {
    console.error('Error migrating old offline data:', error);
    return false;
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
