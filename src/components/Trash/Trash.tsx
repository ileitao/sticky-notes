import { useCallback, useState } from 'react';
import type { NoteAction } from '../../types';
import './Trash.css';

interface TrashProps {
  dispatch: React.Dispatch<NoteAction>;
}

export default function Trash({ dispatch }: TrashProps) {
  const [isNoteOver, setIsNoteOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsNoteOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsNoteOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsNoteOver(false);
      const id = e.dataTransfer.getData('noteId'); // gets the noteId setted in Note's drag start
      if (id) dispatch({ type: 'DELETE', id });
    },
    [dispatch],
  );

  return (
    <div
      className={`trash ${isNoteOver ? 'trash--over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {' '}
      🗑️
    </div>
  );
}
