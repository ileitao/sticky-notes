import { useReducer, useEffect, useCallback } from 'react';
import { notesReducer } from './reducers/notesReducer';
import type { Note } from './types';
import Board from './components/Board/Board';
import { getRandomColor } from './utils/colors';
// Bonus III:
import { loadNotes, saveNotes } from './utils/storage';

export default function App() {
  const [notes, dispatch] = useReducer(notesReducer, [], loadNotes);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const handleCreate = useCallback((x: number, y: number) => {
    const note: Note = {
      id: crypto.randomUUID(),
      x,
      y,
      width: 200,
      height: 200,
      text: '',
      color: getRandomColor(), // Bonus IV: Different note colors
    };
    dispatch({ type: 'CREATE', payload: note });
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Board notes={notes} dispatch={dispatch} onCreateNote={handleCreate} />
    </div>
  );
}
