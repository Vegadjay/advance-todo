import { useState, useEffect, useCallback } from 'react';
import { Note, TaskStatus, dummyNotes, FolderColor } from '../utils/dummyData';
import { toast } from '@/hooks/use-toast';

const STORAGE_KEY = 'vibrant-notes-data';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  
  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        // Convert string dates back to Date objects
        const notesWithDates = parsedNotes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt)
        }));
        setNotes(notesWithDates);
      } catch (error) {
        console.error('Failed to parse saved notes:', error);
        setNotes(dummyNotes);
      }
    } else {
      // No saved notes found, use dummy data
      setNotes(dummyNotes);
    }
  }, []);
  
  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);
  
  // Filter notes based on search term and status filter
  const filteredNotes = useCallback(() => {
    return notes.filter(note => {
      const matchesSearch = 
        searchTerm === "" || 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        note.content.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesFilter = filter === 'all' || note.status === filter;
      
      return matchesSearch && matchesFilter;
    });
  }, [notes, searchTerm, filter]);
  
  // Add new note
  const addNote = useCallback((note: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    setNotes(prev => [...prev, newNote]);
    toast({
      title: "Note added",
      description: "Your note has been successfully added."
    });
  }, []);
  
  // Update existing note
  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === id ? { ...note, ...updates } : note
      )
    );
    toast({
      title: "Note updated",
      description: "Your note has been successfully updated."
    });
  }, []);
  
  // Delete note - Improved with validation and error handling
  const deleteNote = useCallback((id: string) => {
    try {
      if (!id) {
        console.error("Cannot delete note: Invalid ID provided");
        toast({
          title: "Error",
          description: "Could not delete note due to invalid ID",
          variant: "destructive"
        });
        return;
      }
      
      setNotes(prev => {
        // Check if the note exists before attempting deletion
        const noteExists = prev.some(note => note.id === id);
        if (!noteExists) {
          console.warn(`Note with ID ${id} not found`);
          toast({
            title: "Warning",
            description: "Note not found. It may have been already deleted.",
            variant: "destructive"
          });
          return prev; // Return unchanged state if note doesn't exist
        }
        
        // Proceed with deletion if note exists
        const updatedNotes = prev.filter(note => note.id !== id);
        
        // Save immediately to localStorage as a backup
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
        
        toast({
          title: "Note deleted",
          description: "Your note has been successfully deleted."
        });
        
        return updatedNotes;
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive"
      });
    }
  }, []);
  
  // Toggle note's pinned status
  const togglePin = useCallback((id: string) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      )
    );
    toast({
      title: "Pin updated",
      description: "Note pin status has been updated."
    });
  }, []);
  
  // Update note status (todo, in-progress, done)
  const updateNoteStatus = useCallback((id: string, status: TaskStatus) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === id ? { ...note, status } : note
      )
    );
  }, []);
  
  // Move note to specific status category with drag and drop
  const moveNote = useCallback((id: string, newStatus: TaskStatus) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === id ? { ...note, status: newStatus } : note
      )
    );
    toast({
      title: "Status updated",
      description: `Note moved to ${newStatus.replace(/([A-Z])/g, ' $1').toLowerCase()}.`
    });
  }, []);
  
  return {
    notes,
    filteredNotes: filteredNotes(),
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    updateNoteStatus,
    moveNote
  };
};