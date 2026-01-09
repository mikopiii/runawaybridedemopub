import React, { useState, useEffect } from 'react';
import { Typewriter } from './Typewriter';
import { DialogueLine } from '../types';

interface GameplayProps {
  onExit: () => void;
}

const INITIAL_BASE_DIALOGUE: DialogueLine[] = [
  { text: "Wakes up", type: 'action' },
  { text: "Ugh, I feel dizzy", type: 'dialogue' },
  { text: "What happened to me?", type: 'dialogue' },
  { text: "Door knocking", type: 'action' },
  { 
    text: "The silence demands an answer...", 
    type: 'choice', 
    choices: ["Come in!", "*Stand up and open the door*"] 
  }
];

export const Gameplay: React.FC<GameplayProps> = ({ onExit }) => {
  const [dialogueHistory, setDialogueHistory] = useState<DialogueLine[]>(INITIAL_BASE_DIALOGUE);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false); // Initially false, triggered after chapter title
  const [showDialogue, setShowDialogue] = useState(false);
  const [hasMadeChoice, setHasMadeChoice] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showChapterTitle, setShowChapterTitle] = useState(true); // Controls opacity of chapter title
  const [isChapterTitleVisibleInDOM, setIsChapterTitleVisibleInDOM] = useState(true); // Controls DOM presence

  useEffect(() => {
    // Phase 1: Show "CHAPTER 1" for 3 seconds
    const chapterTitleDisplayTimer = setTimeout(() => {
      setShowChapterTitle(false); // Start fading out chapter title
      
      // Timer to remove chapter title from DOM after its fade-out transition (1000ms)
      const chapterTitleFadeOutCompleteTimer = setTimeout(() => {
        setIsChapterTitleVisibleInDOM(false);
      }, 1000); // Matches the `duration-1000` for the fade-out animation
      
      // Phase 2: After chapter title starts fading, start blinking sequence
      const blinkDelayTimer = setTimeout(() => {
        setIsBlinking(true); // Start the blink animation
        const actualBlinkTimer = setTimeout(() => {
          setIsBlinking(false); // End blink animation
          setShowDialogue(true); // Show dialogue box
        }, 2500); // Duration of the blink animation
        return () => clearTimeout(actualBlinkTimer);
      }, 500); // Small delay to allow chapter title to begin fading before blink starts
      return () => { 
        clearTimeout(blinkDelayTimer);
        clearTimeout(chapterTitleFadeOutCompleteTimer);
      };

    }, 3000); // "CHAPTER 1" visible for 3 seconds

    return () => {
      clearTimeout(chapterTitleDisplayTimer);
    };
  }, []);

  const nextLine = () => {
    if (currentLineIndex < dialogueHistory.length - 1) {
      setCurrentLineIndex(prev => prev + 1);
    }
  };

  const prevLine = () => {
    if (hasMadeChoice && currentLineIndex === 5) {
      setShowWarning(true);
      const timer = setTimeout(() => setShowWarning(false), 2000);
      return () => clearTimeout(timer);
    }

    if (currentLineIndex > 0) {
      setCurrentLineIndex(prev => prev - 1);
    }
  };

  const handleChoiceSelection = (choiceIndex: number) => {
    const nextLineText = choiceIndex === 0 
      ? "A maid comes in" 
      : "You stood up and opened the door, finding a maid standing outside";
    
    const branchedLine: DialogueLine = { text: nextLineText, type: 'action' };
    
    // Update history: take the first 5 lines and add the new branched line
    const updatedHistory = [...dialogueHistory.slice(0, 5), branchedLine];
    setDialogueHistory(updatedHistory);
    setHasMadeChoice(true);
    setCurrentLineIndex(5); // Move to the 6th page
  };

  const currentLine = dialogueHistory[currentLineIndex];

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center p-8">
      {/* CHAPTER 1 Title */}
      {isChapterTitleVisibleInDOM && (
        <div className={`fixed inset-0 flex items-center justify-center text-white text-4xl md:text-6xl font-serif-horror uppercase tracking-horror z-[101] transition-opacity duration-1000 ease-out ${
          showChapterTitle ? 'opacity-100' : 'opacity-0'
        }`}>
          CHAPTER 1
        </div>
      )}

      {/* POV Waking Overlay */}
      {isBlinking && (
        <div className="fixed inset-0 z-[100] animate-blink pointer-events-none" />
      )}

      {/* Forsake (Exit) Button - Increased opacity from 30 to 60 for better visibility */}
      <button 
        onClick={onExit}
        className="fixed top-12 left-12 font-sans text-[10px] uppercase tracking-horror opacity-60 hover:opacity-100 transition-opacity duration-500"
      >
        Forsake
      </button>

      {/* Dialogue Box Container */}
      <div className={`mt-auto mb-24 w-full max-w-3xl relative transition-all duration-[1500ms] ease-out ${
        showDialogue ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'
      }`}>
        
        {/* Warning Popup */}
        <div className={`absolute -top-16 left-1/2 -translate-x-1/2 transition-all duration-500 pointer-events-none ${
          showWarning ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="bg-black/80 border border-white/10 px-6 py-2 backdrop-blur-md shadow-2xl">
            <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-white/60 whitespace-nowrap">
              No backing out on your decisions
            </p>
          </div>
        </div>

        <div className="bg-black/90 border border-white/5 p-12 min-h-[220px] relative backdrop-blur-xl shadow-2xl flex flex-col">
          {/* Page Count */}
          <div className="absolute top-4 right-6 text-[9px] uppercase tracking-[0.3em] opacity-20 font-sans select-none">
            {currentLineIndex + 1} / {dialogueHistory.length}
          </div>

          <div className="flex-grow flex items-center justify-center min-h-[80px] mb-8" key={`content-${currentLineIndex}`}>
             {currentLine.type === 'action' ? (
                <p className="text-white/30 italic font-serif-horror text-xs text-center">
                  * <Typewriter key={`typewriter-${currentLineIndex}`} text={currentLine.text} speed={40} /> *
                </p>
             ) : currentLine.type === 'dialogue' ? (
                <p className="text-white/90 text-sm font-serif-horror tracking-[0.15em] text-center leading-relaxed">
                  <Typewriter key={`typewriter-${currentLineIndex}`} text={currentLine.text} speed={40} />
                </p>
             ) : (
                <div className="flex flex-col space-y-4 w-full items-center animate-flicker">
                  <div className="flex flex-col md:flex-row md:space-x-6 space-y-3 md:space-y-0 w-full justify-center items-center">
                    {currentLine.choices?.map((choice, idx) => (
                      <button 
                        key={idx}
                        className="font-sans text-[10px] uppercase tracking-horror border border-white/10 px-8 py-3 min-w-[240px] hover:bg-white/5 hover:border-white/30 transition-all duration-500 opacity-60 hover:opacity-100 hover:tracking-[0.55em]"
                        onClick={() => handleChoiceSelection(idx)}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </div>
             )}
          </div>

          {/* Navigation */}
          <div className="mt-auto px-2 pb-2 flex justify-between items-center w-full">
            <button 
              onClick={prevLine}
              disabled={currentLineIndex === 0}
              className={`text-[9px] uppercase tracking-[0.4em] transition-all duration-500 ${
                currentLineIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-30 hover:opacity-100 hover:tracking-[0.5em]'
              }`}
            >
              PREVIOUS
            </button>
            
            {currentLine.type !== 'choice' && currentLineIndex < dialogueHistory.length - 1 ? (
              <button 
                onClick={nextLine}
                className="text-[9px] uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-all duration-500 hover:tracking-[0.5em] flex items-center"
              >
                NEXT
              </button>
            ) : currentLine.type !== 'choice' && (
              <div className="bounce-indicator flex items-center justify-center">
                <span className="text-[9px] uppercase tracking-[0.6em] opacity-40 font-bold">PROCEED</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
