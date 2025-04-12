import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FolderOpen, Folder, Sparkles } from 'lucide-react';
import { Note, FolderColor } from '@/utils/dummyData';
import { formatDate } from '@/utils/dateUtils';
import TaskBoard from './TaskBoard';

interface FolderButtonProps {
  date: Date;
  notes: Note[];
  color: FolderColor;
  togglePin: (id: string) => void;
  deleteNote: (id: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  moveNote: (id: string, status: string) => void;
}

const FolderButton = ({ 
  date, 
  notes, 
  color, 
  togglePin, 
  deleteNote, 
  updateNote, 
  moveNote 
}: FolderButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const toggleFolder = (e: React.MouseEvent) => {
    // Only toggle if the click is directly on the folder container, not on its children
    if (e.currentTarget === e.target || e.target instanceof Element && e.currentTarget.contains(e.target) && 
        !e.target.closest('.taskboard-content')) {
      setIsOpen(!isOpen);
    }
  };
  
  const formattedDate = formatDate(date);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Enhanced folder animations with elastic spring effect
  const folderVariants = {
    closed: { 
      height: 140,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 30,
        duration: 0.05
      }
    },
    open: { 
      height: "auto",
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 30,
        duration: 0.05
      }
    }
  };

  // Enhanced content animations
  const contentVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const noteCountByStatus = {
    todo: notes.filter(n => n.status === 'todo').length,
    inProgress: notes.filter(n => n.status === 'inProgress').length,
    done: notes.filter(n => n.status === 'done').length,
    total: notes.length
  };

  // Create a wrapper for the deleteNote function to stop event propagation
  const handleDeleteNote = (id: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNote(id);
  };

  return (
    <motion.div
      className={`folder-shadow backdrop-blur-md bg-card/80 rounded-lg mb-5 overflow-hidden relative border-2 enhanced-folder cursor-pointer 
      ${isOpen ? `border-folder-${color} bg-card/95` : 'border-border'}`}
      style={{ 
        borderColor: isOpen ? `var(--folder-${color})` : '',
        boxShadow: isHovered ? `0 10px 25px rgba(var(--folder-${color}-rgb), 0.3)` : '',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)' // For Safari support
      }}
      variants={folderVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      layout
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={toggleFolder}
      transition={{
        layout: { type: "spring", stiffness: 400, damping: 40 }
      }}
    >
      {/* Add a subtle background blur effect layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10 backdrop-blur-[2px]" />

      {/* Interactive glow effect on hover */}
      {isHovered && !isOpen && (
        <motion.div 
          className={`absolute pointer-events-none bg-folder-${color} rounded-full blur-xl`}
          style={{ 
            width: 70, 
            height: 70, 
            left: mousePosition.x - 35, 
            top: mousePosition.y - 35,
            opacity: 0.15
          }}
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Sparkle effects */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            className={`absolute text-folder-${color} opacity-80`}
            style={{ left: mousePosition.x - 8, top: mousePosition.y - 8 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.8, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <Sparkles size={16} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Folder header */}
      <motion.div
        className={`relative flex items-center justify-between p-6 ${
          isOpen ? 'bg-background/5 backdrop-blur-sm' : ''
        }`}
      >
        <div className="flex items-center">
          <div className="mr-4 relative">
            {isOpen ? (
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", duration: 0.3 }}
              >
                <FolderOpen className={`h-7 w-7 text-folder-${color}`} />
                {isHovered && (
                  <motion.div
                    className="absolute -top-1 -right-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Sparkles className={`h-3 w-3 text-folder-${color}`} />
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                whileHover={{ y: -2 }}
                className="relative"
              >
                <Folder className={`h-7 w-7 text-folder-${color}`} />
                <AnimatePresence>
                  {isHovered && (
                    <motion.div 
                      className={`absolute -top-1 -right-1 text-folder-${color} opacity-80`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 0.8, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                    >
                      <Sparkles size={12} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
          <div>
            <motion.h3 
              className="text-xl font-medium"
              animate={{ scale: isOpen ? 1.03 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {formattedDate}
            </motion.h3>
            <motion.div 
              className="text-xs text-muted-foreground mt-1"
              animate={{ opacity: isHovered || isOpen ? 1 : 0.7 }}
              transition={{ duration: 0.2 }}
            >
              {noteCountByStatus.total} notes • 
              <span className="ml-1">{noteCountByStatus.todo} to do</span> • 
              <span className="ml-1">{noteCountByStatus.inProgress} in progress</span> • 
              <span className="ml-1">{noteCountByStatus.done} complete</span>
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`text-folder-${color} p-2 rounded-full ${isOpen ? 'bg-black/5 dark:bg-white/5' : ''}`}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </motion.div>
      
      {/* Folder content with improved animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="px-0 pt-0 pb-3 taskboard-content"
            onClick={(e) => e.stopPropagation()} // Stop clicks in the TaskBoard from toggling the folder
          >
            <TaskBoard
              notes={notes}
              togglePin={togglePin}
              deleteNote={handleDeleteNote} // Pass the wrapped function
              updateNote={updateNote}
              moveNote={moveNote}
              folderColor={color}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FolderButton;