import React, { useState, useEffect, useCallback } from 'react';
import { Typewriter } from './Typewriter';
import { getWhisper } from '../services/gemini';

interface MainMenuProps {
  onStart: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStart }) => {
  const [whisper, setWhisper] = useState("A marriage full of mystery, thoughts fogged up by misery.");
  const [hasApiError, setHasApiError] = useState(false);

  const fetchWhisper = useCallback(async () => {
    const result = await getWhisper();
    setWhisper(result.text);
    setHasApiError(result.isError);
  }, []);

  useEffect(() => {
    fetchWhisper();
    
    // Refresh whisper every 45 seconds to keep the atmosphere alive
    const interval = setInterval(fetchWhisper, 45000);
    return () => clearInterval(interval);
  }, [fetchWhisper]);

  const handleFixApi = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      try {
        await (window as any).aistudio.openSelectKey();
        // After selecting key, attempt to fetch again
        fetchWhisper();
      } catch (e) {
        console.error("Failed to open key selector", e);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between py-24 px-8 relative">
      {/* Header */}
      <header className="flex flex-col items-center space-y-6">
        <h1 className="font-serif-horror text-5xl md:text-8xl tracking-horror animate-flicker animate-blink-light font-light text-center select-none uppercase">
          Runaway Bride
        </h1>
        <div className="h-[1px] w-32 bg-white/10" />
      </header>

      {/* Navigation */}
      <nav className="flex flex-col space-y-10 items-center">
        <MenuButton label="Walk the Aisle" onClick={onStart} />
        <MenuButton label="Recall the Past" disabled />
        <MenuButton label="Alter Reality" />
        <MenuButton label="Forsake" onClick={() => window.location.reload()} />
      </nav>

      {/* Footer Whisper */}
      <footer className="max-w-2xl text-center px-4 flex flex-col items-center space-y-6">
        <p className="font-serif-horror italic text-sm md:text-base text-white/70 leading-relaxed min-h-[4em] tracking-wider">
          <Typewriter 
            key={whisper}
            text={whisper} 
            speed={90} 
            className="animate-flicker"
          />
        </p>
      </footer>
    </div>
  );
};

const MenuButton: React.FC<{ label: string; onClick?: () => void; disabled?: boolean }> = ({ 
  label, 
  onClick, 
  disabled = false 
}) => {
  return (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`button-container flex flex-col items-center group transition-all duration-700 ${
        disabled ? 'opacity-[0.15] cursor-not-allowed' : 'cursor-pointer hover:opacity-100 opacity-60'
      }`}
    >
      <span className="button-text font-sans text-[10px] md:text-[11px] uppercase tracking-horror transition-all duration-500 ease-out">
        {label}
      </span>
      {!disabled && <div className="button-underline" />}
    </button>
  );
};
