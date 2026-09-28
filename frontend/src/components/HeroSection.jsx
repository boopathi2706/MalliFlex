import React from 'react';
import { useApp } from '../context/AppContext';
import { Play, Heart, Info, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const HeroSection = ({ movie }) => {
  const { favourites, toggleFavourite, openMovieDetails, playMovie } = useApp();

  if (!movie) return null;

  const isFav = favourites.includes(movie.id);

  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[85vh] min-h-[500px] overflow-hidden flex items-end pb-12 sm:pb-20">
      {/* Hero Backdrop Image with object-cover */}
      <div className="absolute inset-0 z-0">
        <img
          src={movie.backdropUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-top filter brightness-90 contrast-105 transform scale-105 transition-transform duration-1000"
        />
        
        {/* Layered Cinematic Gradients (Dark Jasmine Theme Overlay) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08130D] via-[#08130D]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08130D] via-[#08130D]/80 to-transparent w-full md:w-3/4" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#08130D]/80 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          {/* Tag / Category Badge */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#173B2B]/90 text-[#E2C766] border border-[#C9A227]/40 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" /> Featured Spotlight
            </span>
            <span className="text-xs font-medium text-[#A9B8AE] bg-[#10251A]/80 px-2.5 py-1 rounded-md border border-[#2F5D3A]/40">
              {movie.category}
            </span>
          </div>

          {/* Hero Title (Playfair Display) */}
          <h1 className="font-serif-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#FFFDF7] drop-shadow-lg leading-tight mb-4">
            {movie.title}
          </h1>

          {/* Metadata Bar */}
          <div className="flex items-center flex-wrap gap-3 text-xs sm:text-sm text-[#A9B8AE] mb-4">
            <span className="text-[#C9A227] font-semibold">{movie.year}</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-[#10251A] border border-[#173B2B] font-medium text-[#FFFDF7]">
              {movie.language}
            </span>
            <span>•</span>
            <span>{movie.duration}</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">{movie.genre}</span>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#A9B8AE] line-clamp-3 mb-8 leading-relaxed max-w-xl font-light">
            {movie.description}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-4">
            <button
              onClick={() => playMovie(movie)}
              className="px-6 py-3 rounded-full bg-[#C9A227] hover:bg-[#E2C766] text-[#08130D] font-bold text-sm sm:text-base flex items-center gap-2 shadow-xl hover:shadow-[#C9A227]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Play className="w-5 h-5 fill-current" /> Watch Now
            </button>

            <button
              onClick={() => toggleFavourite(movie.id)}
              className={`px-6 py-3 rounded-full font-semibold text-sm sm:text-base flex items-center gap-2 border backdrop-blur-md transition-all ${
                isFav
                  ? 'bg-[#173B2B] text-[#C9A227] border-[#C9A227]'
                  : 'bg-[#10251A]/80 text-[#FFFDF7] border-[#2F5D3A]/60 hover:bg-[#173B2B]'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-current text-[#C9A227]' : ''}`} />
              {isFav ? 'In Favourites' : '＋ Add to Favourites'}
            </button>

            <button
              onClick={() => openMovieDetails(movie)}
              className="p-3 rounded-full bg-[#10251A]/60 text-[#A9B8AE] hover:text-white hover:bg-[#173B2B] border border-[#2F5D3A]/40 backdrop-blur-md transition-colors"
              title="More Info"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
