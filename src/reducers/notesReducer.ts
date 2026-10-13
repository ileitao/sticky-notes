import type { Note, NoteAction } from '../types';

export function notesReducer(state: Note[], action: NoteAction): Note[] {
  switch (action.type) {
    case 'CREATE':
      return [...state, action.payload];
    case 'MOVE':
      return state.map((note) =>
        note.id === action.id ? { ...note, x: action.x, y: action.y } : note,
      );
    case 'RESIZE':
      return state.map((note) =>
        note.id === action.id
          ? { ...note, width: action.width, height: action.height }
          : note,
      );
    // Bonus I:
    case 'UPDATE_TEXT':
      return state.map((note) =>
        note.id === action.id ? { ...note, text: action.text } : note,
      );
    case 'DELETE':
      return state.filter((note) => note.id !== action.id);
    // Bonus II:
    case 'BRING_TO_FRONT':
      const note = state.find((n) => n.id === action.id);
      if (!note) return state;
      return [...state.filter((n) => n.id !== action.id), note];
    default:
      return state;
  }
}
