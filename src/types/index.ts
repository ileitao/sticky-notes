export interface Note {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: string;
}

export type NoteAction =
  | { type: 'CREATE'; payload: Note }
  | { type: 'MOVE'; id: string; x: number; y: number }
  | { type: 'RESIZE'; id: string; width: number; height: number }
  | { type: 'UPDATE_TEXT'; id: string; text: string }
  | { type: 'DELETE'; id: string }
  | { type: 'BRING_TO_FRONT'; id: string };
