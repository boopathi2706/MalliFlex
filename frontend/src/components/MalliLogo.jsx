import React from 'react';

export const MalliLogo = ({ className = "h-8" }) => {
  return (
    <div className={`flex items-center gap-2 select-none cursor-pointer group ${className}`}>
      {/* Arabian Jasmine Flower Vector Icon */}
      <div className="relative w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full transform transition-transform duration-500 group-hover:rotate-45">
          {/* Jasmine Stem / Leaf Accent */}
          <path d="M50 50 Q30 75 20 90 Q40 85 50 50 Z" fill="#2F5D3A" />
          <path d="M50 50 Q70 75 80 90 Q60 85 50 50 Z" fill="#527A52" />
          {/* Jasmine Petals - Layered white/cream */}
          <ellipse cx="50" cy="22" rx="14" ry="22" fill="#FFFDF7" className="drop-shadow-sm" />
          <ellipse cx="50" cy="78" rx="14" ry="22" fill="#FFFDF7" className="drop-shadow-sm" />
          <ellipse cx="22" cy="50" rx="22" ry="14" fill="#F8F4E8" className="drop-shadow-sm" />
          <ellipse cx="78" cy="50" rx="22" ry="14" fill="#F8F4E8" className="drop-shadow-sm" />
          
          <ellipse cx="30" cy="30" rx="16" ry="16" fill="#FFFDF7" className="drop-shadow-sm" transform="rotate(-45 30 30)" />
          <ellipse cx="70" cy="30" rx="16" ry="16" fill="#FFFDF7" className="drop-shadow-sm" transform="rotate(45 70 30)" />
          <ellipse cx="30" cy="70" rx="16" ry="16" fill="#F2EBDD" className="drop-shadow-sm" transform="rotate(45 30 70)" />
          <ellipse cx="70" cy="70" rx="16" ry="16" fill="#F2EBDD" className="drop-shadow-sm" transform="rotate(-45 70 70)" />
          
          {/* Golden Pollen Center */}
          <circle cx="50" cy="50" r="10" fill="#C9A227" className="animate-pulse" />
          <circle cx="50" cy="50" r="5" fill="#E2C766" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1 font-extrabold tracking-wider text-xl">
          <span className="text-[#FFFDF7] dark:text-[#FFFDF7] light:text-[#173B2B]">MALLI</span>
          <span className="text-[#C9A227]">FLIX</span>
        </div>
        <span className="text-[9px] tracking-[0.25em] text-[#A9B8AE] uppercase font-semibold">
          Cinema & Jasmine
        </span>
      </div>
    </div>
  );
};
