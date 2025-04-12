import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PinButtonProps {
  isPinned: boolean;
  togglePin: () => void;
}

const PinButton = ({ isPinned, togglePin }: PinButtonProps) => {
  return (
    <motion.button
      className={`absolute top-2 right-2 z-10 rounded-full w-8 h-8 flex items-center justify-center
        backdrop-blur-sm transition-colors duration-200
        ${isPinned 
          ? 'bg-primary/15 text-primary hover:bg-primary/25 shadow-sm' 
          : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'}`}
      onClick={(e) => {
        e.stopPropagation();
        togglePin();
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      aria-label={isPinned ? 'Unpin note' : 'Pin note'}
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: isPinned ? -45 : 0,
          scale: isPinned ? 1.1 : 1 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        }}
      >
        {/* Updated SVG for better visual appearance */}
        {isPinned ? (
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        )}
      </motion.div>
      
      {/* Improved feedback ripple effect */}
      <AnimatePresence mode="wait">
        {isPinned && (
          <motion.div
            key="pin-ripple"
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, var(--primary) 0%, transparent 70%)`
            }}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0, scale: 2.5 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default PinButton;
