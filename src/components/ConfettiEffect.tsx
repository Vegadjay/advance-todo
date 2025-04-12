
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ConfettiPieceProps {
  color: string;
  index: number;
  total: number;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ color, index, total }) => {
  const angle = (index / total) * 360;
  const distance = 50 + Math.random() * 100;
  const x = Math.cos((angle * Math.PI) / 180) * distance;
  const y = Math.sin((angle * Math.PI) / 180) * distance;
  const rotate = Math.random() * 360;
  
  return (
    <motion.div
      className="absolute"
      initial={{ 
        x: 0, 
        y: 0, 
        rotate: 0,
        opacity: 1,
        scale: 0
      }}
      animate={{ 
        x, 
        y: y - 50, // Throw slightly upward
        rotate,
        opacity: 0,
        scale: 1
      }}
      transition={{ 
        duration: 0.8 + Math.random() * 0.6,
        ease: [0.2, 0.8, 0.4, 1]
      }}
      style={{ 
        width: 8 + Math.random() * 8,
        height: 8 + Math.random() * 8,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? '50%' : '0%'
      }}
    />
  );
};

interface ConfettiEffectProps {
  colors?: string[];
  pieces?: number;
  triggerAnimation: boolean;
  onComplete?: () => void;
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ 
  colors = ['#9b87f5', '#33C3F0', '#4caf50', '#ff9800', '#ea384c', '#e91e63'],
  pieces = 30,
  triggerAnimation,
  onComplete
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    if (triggerAnimation) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
        if (onComplete) onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [triggerAnimation, onComplete]);
  
  if (!showConfetti) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {Array.from({ length: pieces }).map((_, i) => (
        <ConfettiPiece 
          key={i}
          color={colors[i % colors.length]}
          index={i}
          total={pieces}
        />
      ))}
    </div>
  );
};

export default ConfettiEffect;
