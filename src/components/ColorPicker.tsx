
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderColor, FOLDER_COLORS } from '@/utils/dummyData';

interface ColorPickerProps {
  selectedColor: FolderColor;
  onColorChange: (color: FolderColor) => void;
}

const ColorPicker = ({ selectedColor, onColorChange }: ColorPickerProps) => {
  // Get color name for display
  const getColorName = (color: FolderColor) => {
    return color.charAt(0).toUpperCase() + color.slice(1);
  };

  return (
    <motion.div 
      className="flex flex-wrap gap-2 justify-center p-3"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {FOLDER_COLORS.map((color, index) => (
        <motion.div
          key={color}
          className={`color-option relative w-10 h-10 rounded-full ${selectedColor === color ? 'selected' : ''}`}
          style={{ backgroundColor: `var(--folder-${color})` }}
          whileHover={{ scale: 1.15, boxShadow: `0 0 12px rgba(var(--folder-${color}-rgb), 0.7)` }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onColorChange(color)}
          title={getColorName(color)}
          initial={{ opacity: 0.7, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [2, 0],
            transition: { 
              delay: index * 0.05, 
              duration: 0.3 
            }
          }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence>
            {selectedColor === color && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="w-3 h-3 bg-white rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.8, 1],
                    boxShadow: [
                      `0 0 0px rgba(255, 255, 255, 0.5)`,
                      `0 0 10px rgba(255, 255, 255, 0.8)`,
                      `0 0 0px rgba(255, 255, 255, 0.5)`
                    ]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ColorPicker;
