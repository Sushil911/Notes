import React, { createContext, useCallback, useContext, useState } from 'react';

export interface Note {
  id: string;
  title: string;
  body: string;
  date: string; 
}

interface NotesContextType {
  notes: Note[];
  addNote: (title: string, body: string) => void;
  updateNote: (id: string, title: string, body: string) => void;
  getNoteById: (id: string) => Note | undefined;
}

const NotesContext = createContext<NotesContextType>({
  notes: [],
  addNote: () => {},
  updateNote: () => {},
  getNoteById: () => undefined,
});

export const useNotes = () => useContext(NotesContext);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default Sample Notes
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Brutalist UI Ideas',
      body: 'Use thick borders, solid shadows...',
      date: '2026-05-11',
    },
    {
      id: '2',
      title: 'Shopping List',
      body: 'Red Bull, Coffee',
      date: '2026-05-10',
    },
  ]);

  const addNote = useCallback((title: string, body: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      body,
      date: new Date().toISOString().split('T')[0],
    };
    setNotes((prev) => [newNote, ...prev]);
  }, []);

  const updateNote = useCallback((id: string, title: string, body: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, title, body, date: new Date().toISOString().split('T')[0] }
          : note
      )
    );
  }, []);

  const getNoteById = useCallback(
    (id: string) => notes.find((n) => n.id === id),
    [notes]
  );

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, getNoteById }}>
      {children}
    </NotesContext.Provider>
  );
};