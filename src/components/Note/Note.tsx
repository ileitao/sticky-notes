import { useCallback, useRef, useState, memo } from 'react';
import type { Note, NoteAction } from '../../types';
import './Note.css';

interface NoteProps {
  note: Note;
  dispatch: React.Dispatch<NoteAction>;
  boardRef: React.RefObject<HTMLDivElement | null>;
}

function NoteComponent({ note, dispatch, boardRef }: NoteProps) {
  const noteRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // drag to move
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setData('noteId', note.id);
      e.dataTransfer.effectAllowed = 'move';
      dispatch({ type: 'BRING_TO_FRONT', id: note.id });
      setTimeout(() => setIsDragging(true), 0);
    },
    [note.id, dispatch],
  );

  const handleDragEnd = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      setIsDragging(false);
      if (!boardRef.current) return;
      const rect = boardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - note.width / 2;
      const y = e.clientY - rect.top - note.height / 2;
      dispatch({ type: 'MOVE', id: note.id, x, y });
    },
    [note.id, note.width, note.height, dispatch, boardRef],
  );

  // Resize
  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = note.width;
      const startHeight = note.height;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const newWidth = Math.max(150, startWidth + moveEvent.clientX - startX);
        const newHeight = Math.max(
          150,
          startHeight + moveEvent.clientY - startY,
        );
        dispatch({
          type: 'RESIZE',
          id: note.id,
          width: newWidth,
          height: newHeight,
        });
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [note.id, note.width, note.height, dispatch],
  );

  // Edit text
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch({ type: 'UPDATE_TEXT', id: note.id, text: e.target.value });
    },
    [note.id, dispatch],
  );

  const handleBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  return (
    <div
      ref={noteRef}
      className={`note ${isDragging ? 'note--dragging' : ''}`}
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDoubleClick={handleDoubleClick}
      style={{
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height,
        backgroundColor: note.color,
      }}
    >
      {isEditing ? (
        <textarea
          className="note__textarea"
          value={note.text}
          onChange={handleTextChange}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <p className="note__text">{note.text || 'Double click to edit...'}</p>
      )}
      <div
        className="note__resize-handle"
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  );
}

// Memoized prevents re-rendering all notes when only one changes.
// Since dispatch is stable (from useReducer) and note references only update
// when their data changes, memo effectively limits re-renders to the affected note.
export default memo(NoteComponent);
