
import React from 'react';
import { motion } from 'framer-motion';
import { Note } from '@/utils/dummyData';
import { formatDateTime } from '@/utils/dateUtils';
import { 
  HoverCard, 
  HoverCardTrigger, 
  HoverCardContent 
} from '@/components/ui/hover-card';
import { Calendar, Circle, Clock, CheckCircle } from 'lucide-react';

interface NotePreviewCardProps {
  children: React.ReactNode;
  note: Note;
}

const NotePreviewCard = ({ children, note }: NotePreviewCardProps) => {
  // Get status icon
  const getStatusIcon = () => {
    switch (note.status) {
      case 'todo':
        return <Circle className="h-3 w-3 text-folder-orange" />;
      case 'inProgress':
        return <Clock className="h-3 w-3 text-folder-blue" />;
      case 'done':
        return <CheckCircle className="h-3 w-3 text-folder-green" />;
      default:
        return <Circle className="h-3 w-3" />;
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div>{children}</div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0 shadow-xl overflow-hidden">
        <div className={`h-1 w-full bg-folder-${note.folderColor}`}></div>
        <div className="p-4">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="font-medium mb-1">{note.title}</h3>
            <p className="text-xs text-muted-foreground whitespace-pre-wrap mb-3">
              {note.content.length > 150 
                ? `${note.content.substring(0, 150)}...` 
                : note.content}
            </p>
            <div className="flex justify-between items-center text-xs text-muted-foreground border-t border-border pt-2 mt-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDateTime(note.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                {getStatusIcon()} 
                <span className="capitalize">{note.status}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default NotePreviewCard;
