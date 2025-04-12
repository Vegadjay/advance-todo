
import React from 'react';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';

const THEMES = [
  { name: 'Default Purple', value: 'purple', color: '#9b87f5' },
  { name: 'Ocean Blue', value: 'blue', color: '#33C3F0' },
  { name: 'Forest Green', value: 'green', color: '#4caf50' },
  { name: 'Sunset Orange', value: 'orange', color: '#ff9800' },
  { name: 'Cherry Red', value: 'red', color: '#ea384c' },
  { name: 'Rose Pink', value: 'pink', color: '#e91e63' },
  { name: 'Turquoise', value: 'teal', color: '#4ecdc4' },
  { name: 'Deep Indigo', value: 'indigo', color: '#6610f2' },
];

interface ColorThemeSelectorProps {
  currentTheme: string;
  setTheme: (theme: string) => void;
}

const ColorThemeSelector = ({ currentTheme, setTheme }: ColorThemeSelectorProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full p-3 bg-card shadow-lg"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        aria-label="Color Theme Selector"
      >
        <Palette className="w-6 h-6 text-primary" />
      </motion.button>
      
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute bottom-16 left-0 bg-card/95 backdrop-blur-md rounded-lg shadow-xl p-3 w-56 sm:w-64 border border-border"
        >
          <h3 className="text-sm font-medium mb-2 px-2">Color Theme</h3>
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map((theme) => (
              <motion.button
                key={theme.value}
                onClick={() => {
                  setTheme(theme.value);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm ${
                  currentTheme === theme.value ? 'bg-primary/20' : 'hover:bg-secondary'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: theme.color }}
                />
                <span className="text-xs truncate">{theme.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ColorThemeSelector;
