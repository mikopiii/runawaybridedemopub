import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#000000] overflow-hidden pointer-events-none">
      {/* Central soft white glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-white opacity-[0.03] blur-[150px] rounded-full" 
      />

      {/* Pulsing red shadows in periphery */}
      <div className="absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] bg-[#2a0000] rounded-full blur-[100px] animate-pulse-red" />
      <div className="absolute -bottom-1/4 -right-1/4 w-[70vw] h-[70vw] bg-[#2a0000] rounded-full blur-[100px] animate-pulse-red" style={{ animationDelay: '2s' }} />

      {/* Six vertical lines (lace threads/aisle railings) */}
      <div className="absolute inset-0 flex justify-between px-[10vw]">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-full w-[1px] bg-white opacity-[0.05]" />
        ))}
      </div>

      {/* Fog gradient rising from bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 fog-gradient" />
    </div>
  );
};
