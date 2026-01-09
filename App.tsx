import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GameState } from './types';
import { Background } from './components/Background';
import { Overlay } from './components/Overlay';
import { MainMenu } from './components/MainMenu';
import { Gameplay } from './components/Gameplay';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>(GameState.MENU);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasStartedMusic, setHasStartedMusic] = useState(false);

  // Initialize and handle background music
  useEffect(() => {
    const audio = new Audio('https://assets.mixkit.co/music/preview/mixkit-horror-ambience-96.mp3');
    audio.loop = true;
    audio.volume = 0.15; // "Not too loud"
    audioRef.current = audio;

    const startMusic = () => {
      if (!hasStartedMusic && audioRef.current) {
        audioRef.current.play().catch(err => console.log("Audio play blocked until interaction."));
        setHasStartedMusic(true);
        window.removeEventListener('click', startMusic);
        window.removeEventListener('keydown', startMusic);
      }
    };

    window.addEventListener('click', startMusic);
    window.addEventListener('keydown', startMusic);

    return () => {
      window.removeEventListener('click', startMusic);
      window.removeEventListener('keydown', startMusic);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [hasStartedMusic]);

  const startGame = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setState(GameState.GAMEPLAY);
      setIsTransitioning(false);
    }, 1200);
  }, []);

  const exitToMenu = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setState(GameState.MENU);
      setIsTransitioning(false);
    }, 1200);
  }, []);

  return (
    <div className="relative w-full h-screen text-white flex flex-col items-center justify-center overflow-hidden">
      <Background />
      <Overlay />

      <div className={`w-full h-full flex flex-col items-center justify-center transition-all duration-[1200ms] ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${
        isTransitioning ? 'opacity-0 blur-xl scale-110' : 'opacity-100 blur-0 scale-100'
      }`}>
        {state === GameState.MENU ? (
          <MainMenu onStart={startGame} />
        ) : (
          <Gameplay onExit={exitToMenu} />
        )}
      </div>

      {/* Initial Key Selection Trigger if missing API KEY */}
      <div className="fixed bottom-4 right-4 flex items-center space-x-4">
        {!hasStartedMusic && (
          <span className="text-[8px] opacity-40 uppercase tracking-[0.3em] animate-pulse">
            Click anywhere for atmosphere
          </span>
        )}
        <button 
          onClick={() => (window as any).aistudio?.openSelectKey()} 
          className="text-[8px] opacity-20 hover:opacity-100 uppercase tracking-widest transition-opacity"
        >
          Config API
        </button>
      </div>
    </div>
  );
};

export default App;
