import { useContext, useState, useRef } from 'react';
import noteContext from '../context/notes/noteContext';
import GridLayoutView from './notes-item/GridLayoutView';
import ListLayoutView from './notes-item/ListLayoutView';

const NotesItem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note, updateNote, onShowSnackbar, viewMode } = props;

  const [swipeX, setSwipeX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  const handleDeleteClick = () => {
    if (onShowSnackbar) {
      onShowSnackbar(note, () => deleteNote(note._id));
    } else {
      deleteNote(note._id);
    }
  };

  const handleSwipeDelete = () => {
    if (onShowSnackbar) {
      // Pass the full note object and the delete function
      onShowSnackbar(note, () => deleteNote(note._id));
    } else {
      deleteNote(note._id);
    }
  };

  const handleTouchStart = (e) => {
    if (window.innerWidth > 768) return; // Only on mobile
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || window.innerWidth > 768) return;
    currentX.current = e.touches[0].clientX;
    const diffX = currentX.current - startX.current;
    if (diffX < 0) { // Only allow left swipe
      setSwipeX(Math.max(diffX, -100));
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || window.innerWidth > 768) return;
    setIsDragging(false);

    if (swipeX < -60) { // Threshold for delete
      handleSwipeDelete();
    }
    setSwipeX(0);
  };

  const tagColorMap = {
    Work: {
      borderColor: '#2563eb',
      badgeVariant: 'primary',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)'
    },
    Urgent: {
      borderColor: '#ef4444',
      badgeVariant: 'danger',
      gradient: 'linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #ef4444 100%)'
    },
    Completed: {
      borderColor: '#10b981',
      badgeVariant: 'success',
      gradient: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #10b981 100%)'
    },
    Important: {
      borderColor: '#f59e0b',
      badgeVariant: 'warning',
      gradient: 'linear-gradient(135deg, #92400e 0%, #d97706 50%, #f59e0b 100%)'
    },
    Personal: {
      borderColor: '#06b6d4',
      badgeVariant: 'info',
      gradient: 'linear-gradient(135deg, #0e7490 0%, #0891b2 50%, #06b6d4 100%)'
    },
  };

  const tagInfo = tagColorMap[note.tag] || {
    borderColor: '#6b7280',
    badgeVariant: 'secondary',
    gradient: 'linear-gradient(135deg, #374151 0%, #4b5563 50%, #6b7280 100%)'
  };

  const tagLabel = note.tag || 'No Tag';

  // List view layout
  if (viewMode === 'list') {
    return (
      <ListLayoutView
      tagInfo={tagInfo}
      note={note}
      updateNote={updateNote}
      isDropdownOpen={isDropdownOpen}
      tagLabel={tagLabel}
      setIsDropdownOpen={setIsDropdownOpen}
      handleDeleteClick={handleDeleteClick}
      
      />
    );
  }

  // Grid view layout (original)
  return (
    <GridLayoutView
    tagInfo={tagInfo}
    isDragging={isDragging}
    handleDeleteClick={handleDeleteClick}
    updateNote={updateNote}
    note={note}
    swipeX={swipeX}
    handleTouchStart={handleTouchStart}
    tagLabel={tagLabel}
    handleTouchMove={handleTouchMove}
    handleTouchEnd={handleTouchEnd}
    />
  );
};

export default NotesItem;
