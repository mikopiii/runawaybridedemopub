import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  speed = 40, 
  className, 
  onComplete 
}) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    
    if (!text) return;

    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      
      if (i >= text.length) {
        clearInterval(intervalId);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, onComplete]);

  return <span className={className}>{displayedText}</span>;
};
