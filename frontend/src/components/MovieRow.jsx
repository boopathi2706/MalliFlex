import React, { useRef } from 'react';
import { MovieCard } from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const MovieRow = ({ title, subtitle, movies }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      rowRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="py-6 relative group/row">
      <div className="flex items-end justify-between px-4 sm:px-8 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FFFDF7] light:text-[#173B2B] flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#C9A227] rounded-full inline-block" />
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#A9B8AE] light:text-[#527A52] mt-0.5 ml-3.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Navigation buttons desktop */}
        <div className="hidden sm:flex items-center space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-[#10251A] light:bg-[#F8F4E8] text-[#FFFDF7] light:text-[#173B2B] hover:bg-[#173B2B] border border-[#2F5D3A]/40 transition-colors shadow"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-[#10251A] light:bg-[#F8F4E8] text-[#FFFDF7] light:text-[#173B2B] hover:bg-[#173B2B] border border-[#2F5D3A]/40 transition-colors shadow"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Area */}
      <div
        ref={rowRef}
        className="flex items-center space-x-4 overflow-x-auto no-scrollbar px-4 sm:px-8 scroll-smooth py-2"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="w-36 sm:w-48 lg:w-56 shrink-0">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
};
