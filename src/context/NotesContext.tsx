import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Note, Tag } from '../types';
import { supabase, DbNote } from '../lib/supabase';
import { sendPushNotification } from '../lib/notifications';

interface NotesContextType {
  notes: Note[];
  tags: Tag[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteNote: (id: string) => void;
  getNotesByTag: (tag: string) => Note[];
  toggleNoteCompletion: (id: string) => void;
  completedNotes: Note[];
  pendingNotes: Note[];
  isLoading: boolean;
  isOnline: boolean;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

// Convert database note to app note
const dbToNote = (dbNote: DbNote): Note => ({
  id: dbNote.id,
  title: dbNote.title,
  content: dbNote.content,
  tags: dbNote.tags || [],
  completed: dbNote.completed,
  createdAt: dbNote.created_at,
  updatedAt: dbNote.updated_at,
});

// Convert app note to database format
const noteToDb = (note: Partial<Note>) => ({
  title: note.title || '',
  content: note.content || '',
  tags: note.tags || [],
  completed: note.completed || false,
  updated_at: new Date().toISOString(),
});

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  // Load notes from Supabase
  const loadNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Notlar yüklenirken hata:', error);
        setIsOnline(false);
        // Fallback to localStorage
        const localNotes = localStorage.getItem('notes_backup');
        if (localNotes) {
          setNotes(JSON.parse(localNotes));
        }
        return;
      }

      setIsOnline(true);
      const loadedNotes = (data || []).map(dbToNote);
      setNotes(loadedNotes);
      // Backup to localStorage
      localStorage.setItem('notes_backup', JSON.stringify(loadedNotes));
    } catch (e) {
      console.error('Notlar yüklenirken hata:', e);
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel('notes_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notes' },
        (payload) => {
          console.log('Real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newNote = dbToNote(payload.new as DbNote);
            setNotes(prev => {
              // Check if note already exists
              if (prev.find(n => n.id === newNote.id)) return prev;
              return [newNote, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedNote = dbToNote(payload.new as DbNote);
            setNotes(prev => 
              prev.map(note => note.id === updatedNote.id ? updatedNote : note)
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as DbNote).id;
            setNotes(prev => prev.filter(note => note.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([noteToDb(noteData)])
        .select()
        .single();

      if (error) {
        console.error('Not eklenirken hata:', error);
        return;
      }

      // Real-time will handle the update, but we can add optimistically
      if (data) {
        const newNote = dbToNote(data);
        setNotes(prev => [newNote, ...prev.filter(n => n.id !== newNote.id)]);
        
        // 🔔 Yeni not eklendiğinde bildirim gönder
        const notTitle = noteData.title || 'Yeni Not';
        sendPushNotification(
          '🐼 Yeni Not Eklendi!',
          notTitle
        );
      }
    } catch (e) {
      console.error('Not eklenirken hata:', e);
    }
  };

  const updateNote = async (id: string, noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update(noteToDb(noteData))
        .eq('id', id);

      if (error) {
        console.error('Not güncellenirken hata:', error);
        return;
      }

      // Optimistic update
      setNotes(prev =>
        prev.map(note =>
          note.id === id
            ? { ...note, ...noteData, updatedAt: new Date().toISOString() }
            : note
        )
      );

      // 🔔 Not güncellendiğinde bildirim gönder
      const notTitle = noteData.title || 'Bir Not';
      sendPushNotification(
        '✏️ Not Güncellendi!',
        notTitle
      );
    } catch (e) {
      console.error('Not güncellenirken hata:', e);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Not silinirken hata:', error);
        return;
      }

      // Optimistic update
      setNotes(prev => prev.filter(note => note.id !== id));
    } catch (e) {
      console.error('Not silinirken hata:', e);
    }
  };

  const getNotesByTag = (tag: string): Note[] => {
    return notes.filter(note => note.tags.includes(tag));
  };

  const toggleNoteCompletion = async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    try {
      const { error } = await supabase
        .from('notes')
        .update({ 
          completed: !note.completed,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Not durumu güncellenirken hata:', error);
        return;
      }

      // Optimistic update
      setNotes(prev =>
        prev.map(n =>
          n.id === id
            ? { ...n, completed: !n.completed, updatedAt: new Date().toISOString() }
            : n
        )
      );
    } catch (e) {
      console.error('Not durumu güncellenirken hata:', e);
    }
  };

  const completedNotes = React.useMemo(() => {
    return notes.filter(note => note.completed);
  }, [notes]);

  const pendingNotes = React.useMemo(() => {
    return notes.filter(note => !note.completed);
  }, [notes]);

  const tags: Tag[] = React.useMemo(() => {
    const tagMap = new Map<string, number>();
    notes.forEach(note => {
      note.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [notes]);

  return (
    <NotesContext.Provider
      value={{
        notes,
        tags,
        addNote,
        updateNote,
        deleteNote,
        getNotesByTag,
        toggleNoteCompletion,
        completedNotes,
        pendingNotes,
        isLoading,
        isOnline,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
