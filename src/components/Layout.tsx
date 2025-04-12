
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useToast } from '@/hooks/use-toast';

interface LayoutProps {
  children: React.ReactNode;
  colorTheme?: string;
}

const Layout = ({ children, colorTheme = 'purple' }: LayoutProps) => {
  const { toast } = useToast();
  
  // Apply theme class to root element whenever it changes
  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.forEach(className => {
      if (className.startsWith('theme-')) {
        document.documentElement.classList.remove(className);
      }
    });
    
    // Add current theme class
    document.documentElement.classList.add(`theme-${colorTheme}`);
    
    // Update CSS variables for folder colors
    const root = document.documentElement;
    const themeColorMap: Record<string, string> = {
      purple: '#9b87f5',
      blue: '#33C3F0',
      green: '#4caf50',
      orange: '#ff9800',
      red: '#ea384c',
      pink: '#e91e63',
      teal: '#4ecdc4',
      indigo: '#6610f2'
    };
    
    // Set the folder color CSS variables and update primary color in both light and dark modes
    Object.entries(themeColorMap).forEach(([name, value]) => {
      root.style.setProperty(`--folder-${name}`, value);
      
      // Update primary color when theme changes (both in light and dark mode)
      if (name === colorTheme) {
        const isDarkMode = document.documentElement.classList.contains('dark');
        // Convert hex to hsl for both dark and light mode
        const hslColor = hexToHSL(value);
        if (hslColor) {
          root.style.setProperty('--primary', `${hslColor.h} ${hslColor.s}% ${hslColor.l}%`);
          root.style.setProperty('--accent', `${hslColor.h} ${hslColor.s}% ${hslColor.l}%`);
          root.style.setProperty('--ring', `${hslColor.h} ${hslColor.s}% ${hslColor.l}%`);
          root.style.setProperty('--theme-color', value);
        }
      }
    });
    
    // Show toast message when theme changes
    if (colorTheme) {
      toast({
        title: "Theme Updated",
        description: `Color theme changed to ${colorTheme.charAt(0).toUpperCase() + colorTheme.slice(1)}`,
        duration: 1500
      });
    }
  }, [colorTheme, toast]);

  // Helper function to convert hex to HSL
  const hexToHSL = (hex: string): {h: number, s: number, l: number} | null => {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Parse the RGB values
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // Find min and max values
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    
    // Calculate lightness
    let l = (max + min) / 2;
    
    // Calculate saturation
    let s = 0;
    if (max !== min) {
      s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
    }
    
    // Calculate hue
    let h = 0;
    if (max !== min) {
      switch (max) {
        case r:
          h = (g - b) / (max - min) + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / (max - min) + 2;
          break;
        case b:
          h = (r - g) / (max - min) + 4;
          break;
      }
      h /= 6;
    }
    
    // Convert to degrees and percent
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    return { h, s, l };
  };

  return (
    <div className="min-h-screen bg-background bg-dotted-pattern">
      <div className="theme-indicator" aria-hidden="true" />
      <div className="py-1.5 px-4 bg-destructive/10 text-destructive text-center text-sm">
        All data is stored in localStorage - no backend required
      </div>
      <motion.div
        className="max-w-7xl mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
      <ThemeToggle />
    </div>
  );
};

export default Layout;
