import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Edit, Trash, Share2, Sparkles } from 'lucide-react';
import { Note } from '@/utils/dummyData';
import { formatDateTime } from '@/utils/dateUtils';
import PinButton from './PinButton';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import NotePreviewCard from './NotePreviewCard';

interface NoteCardProps {
  note: Note;
  togglePin: (id: string) => void;
  deleteNote: (id: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  isDragging?: boolean;
}

const NoteCard = ({ 
  note, 
  togglePin, 
  deleteNote, 
  updateNote, 
  isDragging = false 
}: NoteCardProps) => {
  const { toast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [isHovered, setIsHovered] = useState(false);
  const [sparklePosition, setSparklePosition] = useState({ x: 0, y: 0 });

  const handleSaveEdit = () => {
    updateNote(note.id, { 
      content: editedContent,
      title: editedTitle 
    });
    setIsEditOpen(false);
    toast({
      title: "Note updated",
      description: "Your changes have been saved."
    });
  };

  const handleConfirmDelete = () => {
    deleteNote(note.id);
    setIsDeleteOpen(false);
    toast({
      title: "Note deleted",
      description: "The note has been removed."
    });
  };

  const handleShare = () => {
    // Create shareable text
    const shareText = `${note.title}\n\n${note.content}\n\nShared from Vibrant Notes`;
    
    // Use navigator.share if available, otherwise fallback to clipboard
    if (navigator.share) {
      navigator.share({
        title: note.title,
        text: shareText
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        toast({
          title: "Note copied to clipboard",
          description: "Share your note with others by pasting it."
        });
      });
    }
    setIsShareOpen(false);
  };

  // Function to update sparkle position on mousemove
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isHovered) {
      const rect = e.currentTarget.getBoundingClientRect();
      setSparklePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  return (
    <>
      <motion.div
        className="note-card relative p-4 rounded-lg bg-card/90 backdrop-blur-sm border border-border hover:shadow-lg transition-shadow"
        style={{
          borderLeftColor: `var(--folder-${note.folderColor})`,
          borderLeftWidth: '4px'
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -4, boxShadow: `0 10px 25px rgba(var(--folder-${note.folderColor}-rgb), 0.2)` }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        layout
        data-note-id={note.id}
      >
        {/* Dynamic sparkle effect that follows mouse */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              className={`absolute text-folder-${note.folderColor} opacity-70 pointer-events-none`}
              style={{ 
                left: sparklePosition.x - 8, 
                top: sparklePosition.y - 8
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles size={16} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Static sparkle effect in corner */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              className="absolute top-2 left-2 text-folder-indigo opacity-70"
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles size={16} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <PinButton 
          isPinned={note.isPinned}
          togglePin={() => togglePin(note.id)}
        />

        <h3 className="font-medium text-lg mb-2 pr-8">{note.title}</h3>
        
        <div className="text-sm whitespace-pre-wrap mb-4">
          {note.content.length > 100 
            ? `${note.content.substring(0, 100)}...` 
            : note.content}
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground mt-2">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{formatDateTime(note.createdAt)}</span>
        </div>
        
        <div className="flex gap-2 mt-4 justify-end">
          <motion.button
            className={`p-1.5 rounded-md text-muted-foreground hover:text-folder-${note.folderColor} hover:bg-folder-${note.folderColor}/10`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditedContent(note.content);
              setEditedTitle(note.title);
              setIsEditOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </motion.button>
          
          <NotePreviewCard note={note}>
            <motion.button
              className={`p-1.5 rounded-md text-muted-foreground hover:text-folder-${note.folderColor} hover:bg-folder-${note.folderColor}/10`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsShareOpen(true)}
            >
              <Share2 className="h-4 w-4" />
            </motion.button>
          </NotePreviewCard>
          
          <motion.button
            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              // Add animation before deletion
              const noteElement = e.currentTarget.closest('.note-card');
              if (noteElement) {
                noteElement.style.transition = 'all 0.3s ease-out';
                noteElement.style.transform = 'scale(0.95)';
                noteElement.style.opacity = '0';
              }
              // Delay the actual deletion slightly for animation
              setTimeout(() => {
                deleteNote(note.id);
                toast({
                  title: "Note Deleted",
                  description: "Your note has been successfully deleted.",
                  variant: "default"
                });
              }, 200);
            }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Trash className="h-4 w-4" />
            </motion.div>
          </motion.button>
        </div>
        
        {/* Enhanced glow line animation */}
        {isHovered && (
          <>
            <motion.div
              className={`absolute bottom-0 left-0 h-0.5 bg-folder-${note.folderColor}`}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              exit={{ width: 0 }}
              transition={{ duration: 0.3 }}
            />
            {/* Corner accents */}
            <motion.div
              className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 rounded-tr-md border-folder-${note.folderColor}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 rounded-br-md border-folder-${note.folderColor}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          </>
        )}
      </motion.div>

      {/* Edit Dialog */}
      <AlertDialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Note</AlertDialogTitle>
            <AlertDialogDescription>
              Make changes to your note below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="aesthetic-input"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">Content</label>
              <Textarea
                id="content"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={6}
                className="aesthetic-input resize-none"
              />
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveEdit} className={`btn-themed btn-glow bg-folder-${note.folderColor} hover:bg-folder-${note.folderColor}/90`}>Save Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The note will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Share Dialog */}
      <AlertDialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share Note</AlertDialogTitle>
            <AlertDialogDescription>
              Share this note with others.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="bg-muted p-4 rounded-md text-sm">
              <p className="font-medium">{note.title}</p>
              <p className="mt-2 text-muted-foreground">{note.content}</p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleShare} className={`btn-glow bg-folder-${note.folderColor} text-primary-foreground hover:bg-folder-${note.folderColor}/90`}>
              {navigator.share ? 'Share' : 'Copy to Clipboard'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NoteCard;
