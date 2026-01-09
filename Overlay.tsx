import React from 'react';

export const Overlay: React.FC = () => {
  return (
    <>
      {/* Film Grain */}
      <div className="fixed inset-[-100%] z-[9999] pointer-events-none noise-overlay opacity-[0.04] animate-film-grain" />
      
      {/* Vignette */}
      <div className="fixed inset-0 z-[9998] pointer-events-none vignette" />
    </>
  );
};
