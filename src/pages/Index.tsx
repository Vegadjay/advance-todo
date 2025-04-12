import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle, Circle, Clock, Palette, Minus } from 'lucide-react';
import { Note, FolderColor, FOLDER_COLORS } from '@/utils/dummyData';
import { formatDate, groupByDate } from '@/utils/dateUtils';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import FolderButton from '@/components/FolderButton';
import { useNotes } from '@/hooks/useNotes';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ColorThemeSelector from '@/components/ColorThemeSelector';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';

const Index = () => {
  const { toast } = useToast();
  const {
    notes,
    filteredNotes,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    moveNote
  } = useNotes();

  const [showForm, setShowForm] = useState(false);
  const [newNote, setNewNote] = useState<{
    title: string;
    content: string;
    folderColor: FolderColor;
  }>({
    title: '',
    content: '',
    folderColor: 'purple',
  });
  
  // Color theme state
  const [colorTheme, setColorTheme] = useState('purple');

  useEffect(() => {
    // Load color theme from localStorage if available
    const savedTheme = localStorage.getItem('vibrant-notes-theme');
    if (savedTheme) {
      setColorTheme(savedTheme);
    }
  }, []);

  // Save color theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('vibrant-notes-theme', colorTheme);
  }, [colorTheme]);

  // Update useEffect to set the newNote color when colorTheme changes
  useEffect(() => {
    setNewNote(prev => ({
      ...prev,
      folderColor: colorTheme as FolderColor
    }));
  }, [colorTheme]);

  // Group notes by date
  const notesByDate = React.useMemo(() => {
    return groupByDate(filteredNotes);
  }, [filteredNotes]);

  // Sort dates in descending order (newest first)
  const sortedDates = React.useMemo(() => {
    return Object.keys(notesByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [notesByDate]);

  // For each date, assign a consistent folder color
  const dateColors = React.useMemo(() => {
    return sortedDates.reduce((acc, date, index) => {
      acc[date] = FOLDER_COLORS[index % FOLDER_COLORS.length];
      return acc;
    }, {} as Record<string, FolderColor>);
  }, [sortedDates]);

  // Handler for adding a new note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required.",
        variant: "destructive"
      });
      return;
    }
    
    // Use the selected folder color
    addNote({
      ...newNote,
      isPinned: false,
      status: 'todo',
    });
    
    setNewNote({
      title: '',
      content: '',
      folderColor: 'purple',
    });
    
    setShowForm(false);
    
    toast({
      title: "Note Added",
      description: "Your new note has been successfully created.",
    });
  };

  // Folder animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const folderVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    }
  };

  // Add these animation variants near your other variants
  const formVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    visible: { 
      opacity: 1, 
      height: "auto",
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  // Renders the filters for task status
  const renderFilters = () => {
    const filters = [
      { value: 'all', label: 'All Notes', icon: null },
      { value: 'todo', label: 'To Do', icon: <Circle className="h-4 w-4 mr-1" /> },
      { value: 'inProgress', label: 'In Progress', icon: <Clock className="h-4 w-4 mr-1" /> },
      { value: 'done', label: 'Done', icon: <CheckCircle className="h-4 w-4 mr-1" /> },
    ];
    
    return (
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <Button
            key={f.value}
            variant={filter === f.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f.value as any)}
            className={filter === f.value ? "btn-themed" : ""}
          >
            {f.icon}
            {f.label}
          </Button>
        ))}
      </div>
    );
  };

  // Get color name for display
  const getColorName = (color: FolderColor) => {
    return color.charAt(0).toUpperCase() + color.slice(1);
  };

  // Renders the add note form
  const renderAddNoteForm = () => {
    return (
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="mb-6 origin-top"
      >
        <motion.form 
          onSubmit={handleAddNote} 
          className={`bg-card/90 backdrop-blur-sm p-6 rounded-lg border-2 shadow-lg
          ${newNote.folderColor ? `border-folder-${newNote.folderColor}` : 'border-border'}`}
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          exit={{ y: -20 }}
        >
          {/* Add a colored tab at the top of the form */}
          <div className={`h-1 w-full bg-folder-${newNote.folderColor} rounded-full mb-5 transition-colors`}></div>
          
          <h2 className="text-lg font-medium mb-5">Add New Note</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              type="text"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className={`aesthetic-input focus-visible:ring-folder-${newNote.folderColor}`}
              placeholder="Enter title..."
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Content</label>
            <Textarea
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              rows={4}
              className={`aesthetic-input resize-none focus-visible:ring-folder-${newNote.folderColor}`}
              placeholder="Enter content..."
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  // Add animation before closing
                  const form = document.querySelector('form');
                  if (form) {
                    form.style.transition = 'all 0.2s ease-in-out';
                    form.style.transform = 'scale(0.95)';
                    form.style.opacity = '0';
                  }
                  // Delay the actual closing slightly
                  setTimeout(() => setShowForm(false), 200);
                }}
                className="relative overflow-hidden group"
              >
                <span className="relative z-10">Cancel</span>
                <motion.div
                  className="absolute inset-0 bg-destructive/10 dark:bg-destructive/20"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                className={`btn-themed bg-folder-${newNote.folderColor} hover:bg-folder-${newNote.folderColor}/90
                transition-colors duration-200`}
              >
                Add Note
              </Button>
            </motion.div>
          </div>
        </motion.form>
      </motion.div>
    );
  };

  // Renders the pinned notes section
  const renderPinnedNotes = () => {
    const pinnedNotes = notes.filter(note => note.isPinned);
    
    if (pinnedNotes.length === 0) return null;
    
    return (
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-medium mb-4 flex items-center">
          <span className="mr-2">📌</span> Pinned Notes
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {pinnedNotes.map((note) => (
            <motion.div
              key={note.id}
              className={`p-5 rounded-lg border-l-4 border-folder-${note.folderColor} bg-card/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow`}
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-medium text-lg mb-1">{note.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {note.content.length > 100 
                  ? `${note.content.substring(0, 100)}...` 
                  : note.content}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {formatDate(note.createdAt)}
                </span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-xs"
                  onClick={() => togglePin(note.id)}
                >
                  Unpin
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  // Main page render
  return (
    <Layout colorTheme={colorTheme}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Vibrant Notes</h1>
      </motion.div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 btn-themed w-full"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: showForm ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {showForm ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </motion.div>
            <span>{showForm ? 'Cancel' : 'New Note'}</span>
          </Button>
        </motion.div>
      </div>
      
      <AnimatePresence mode="wait">
        {showForm && renderAddNoteForm()}
      </AnimatePresence>
      
      {renderFilters()}
      
      {renderPinnedNotes()}
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-5"
      >
        {sortedDates.length > 0 ? (
          sortedDates.map((dateKey) => {
            const dateNotes = notesByDate[dateKey];
            const color = dateColors[dateKey];
            
            return (
              <motion.div key={dateKey} variants={folderVariants}>
                <FolderButton
                  date={new Date(dateKey)}
                  notes={dateNotes}
                  color={color}
                  togglePin={togglePin}
                  deleteNote={deleteNote}
                  updateNote={updateNote}
                  moveNote={moveNote}
                />
              </motion.div>
            );
          })
        ) : (
          <motion.div 
            className="text-center py-16 text-muted-foreground"
            variants={folderVariants}
          >
            <h2 className="text-xl mb-2">No notes found</h2>
            <p>Create a new note to get started or adjust your filters.</p>
          </motion.div>
        )}
      </motion.div>
      
      <ColorThemeSelector currentTheme={colorTheme} setTheme={setColorTheme} />
    </Layout>
  );
};

export default Index;
