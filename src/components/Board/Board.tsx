import { useCallback, useRef } from 'react';
import type { Note, NoteAction } from '../../types';
import NoteComponent from '../Note/Note';
import Trash from '../Trash/Trash';
import './Board.css';

interface BoardProps {
  notes: Array<Note>;
  dispatch: React.Dispatch<NoteAction>;
  onCreateNote: (x: number, y: number) => void;
}

export default function Board({ notes, dispatch, onCreateNote }: BoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  // This handles note creation on the Board
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target !== boardRef.current) return; // dismiss double-click on anything else than the board
      const rect = boardRef.current.getBoundingClientRect();
      onCreateNote(e.clientX - rect.left, e.clientY - rect.top);
    },
    [onCreateNote],
  );

  return (
    <div ref={boardRef} className={'board'} onDoubleClick={handleDoubleClick}>
      {notes.map((note) => (
        <NoteComponent
          key={note.id}
          note={note}
          dispatch={dispatch}
          boardRef={boardRef}
        />
      ))}
      <Trash dispatch={dispatch} />
    </div>
  );
}
