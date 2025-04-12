
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Note, TaskStatus } from '@/utils/dummyData';
import NoteCard from './NoteCard';
import ConfettiEffect from './ConfettiEffect';

interface TaskBoardProps {
  notes: Note[];
  togglePin: (id: string) => void;
  deleteNote: (id: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  moveNote: (id: string, status: TaskStatus) => void;
  folderColor?: string;
}

const TaskBoard = ({ 
  notes, 
  togglePin, 
  deleteNote, 
  updateNote, 
  moveNote,
  folderColor 
}: TaskBoardProps) => {
  // State to track confetti animation
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastMovedToDone, setLastMovedToDone] = useState<string | null>(null);
  
  // Group notes by status
  const todoNotes = notes.filter(note => note.status === 'todo');
  const inProgressNotes = notes.filter(note => note.status === 'inProgress');
  const doneNotes = notes.filter(note => note.status === 'done');
  
  // Handle drag end event
  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    
    // If no destination or dropped in the same place
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Convert droppableId to TaskStatus type
    const newStatus = destination.droppableId as TaskStatus;
    
    // Check if we're moving to done column to trigger confetti
    if (newStatus === 'done' && source.droppableId !== 'done') {
      setShowConfetti(true);
      setLastMovedToDone(draggableId);
      // Reset after animation
      setTimeout(() => {
        setShowConfetti(false);
        setLastMovedToDone(null);
      }, 2000);
    }
    
    // Update note status
    moveNote(draggableId, newStatus);
  };
  
  // Column titles and their corresponding droppable IDs
  const columns = [
    { id: 'todo', title: 'To Do', notes: todoNotes, color: 'bg-folder-red/10', icon: '📋' },
    { id: 'inProgress', title: 'In Progress', notes: inProgressNotes, color: 'bg-folder-blue/10', icon: '⏳' },
    { id: 'done', title: 'Done', notes: doneNotes, color: 'bg-folder-green/10', icon: '✅' }
  ];
  
  // Container styles
  const getBorderClass = () => {
    if (!folderColor) return 'border-border';
    return `border-folder-${folderColor}`;
  };
  
  return (
    <>
      <ConfettiEffect 
        triggerAnimation={showConfetti} 
        onComplete={() => setShowConfetti(false)}
      />
      
      <DragDropContext onDragEnd={onDragEnd}>
        <motion.div
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-b-lg border-t-0 border-2 backdrop-blur-sm ${getBorderClass()} bg-white/5 dark:bg-black/10`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {columns.map(column => (
            <div key={column.id} className="flex flex-col">
              <motion.h3 
                className={`font-medium text-lg mb-3 text-center p-3 rounded-lg border border-border/50 ${column.color} shadow-sm backdrop-blur-md flex items-center justify-center gap-2`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span>{column.icon}</span> {column.title}
                <span className="ml-2 text-sm text-muted-foreground">({column.notes.length})</span>
              </motion.h3>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 min-h-[350px] p-3 rounded-lg drop-area ${
                      snapshot.isDraggingOver ? 'active bg-primary/5 backdrop-blur-md scale-[1.01] transition-all' : 'bg-card/30 backdrop-blur-sm'
                    } transition-all duration-200 ease-in-out overflow-y-auto border border-white/10 shadow-inner`}
                  >
                    {column.notes.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm">
                        <div className="text-3xl mb-2 opacity-50">📝</div>
                        <p className="italic">No notes here</p>
                        <p className="text-xs mt-1 opacity-70">Drag and drop notes to organize</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {column.notes.map((note, index) => (
                          <Draggable key={note.id} draggableId={note.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`drag-item transition-all ${snapshot.isDragging ? 'dragging' : ''} ${lastMovedToDone === note.id ? 'just-completed' : ''}`}
                              >
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  transition={{ duration: 0.2 }}
                                  whileHover={{ scale: 1.01 }}
                                >
                                  <NoteCard
                                    note={note}
                                    togglePin={togglePin}
                                    deleteNote={deleteNote}
                                    updateNote={updateNote}
                                    isDragging={snapshot.isDragging}
                                  />
                                </motion.div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </motion.div>
      </DragDropContext>
    </>
  );
};

export default TaskBoard;
