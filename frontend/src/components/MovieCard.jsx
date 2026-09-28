import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Play, Eye, Calendar, Clock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export const MovieCard = ({ movie, isWatchedView = false }) => {
  const { favourites, toggleFavourite, openMovieDetails, playMovie } = useApp();
  const isFav = favourites.includes(movie.id);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative rounded-xl overflow-hidden bg-[#142B20] light:bg-white border border-[#173B2B]/60 light:border-[#E6E0D2] shadow-lg flex flex-col cursor-pointer"
      onClick={() => openMovieDetails(movie)}
    >
      {/* Poster Container with Aspect Ratio */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#08130D]">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08130D] via-[#08130D]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="flex items-center space-x-2 mb-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                playMovie(movie);
              }}
              className="px-3 py-1.5 rounded-full bg-[#C9A227] hover:bg-[#E2C766] text-[#08130D] text-xs font-bold flex items-center gap-1 shadow-md transition-transform active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Play
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavourite(movie.id);
              }}
              className={`p-2 rounded-full border transition-colors ${
                isFav
                  ? 'bg-[#173B2B] border-[#C9A227] text-[#C9A227]'
                  : 'bg-black/40 border-white/30 text-white hover:text-[#C9A227]'
              }`}
              title={isFav ? "Remove from favourites" : "Add to favourites"}
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Additional details on hover */}
          <div className="text-[11px] text-[#A9B8AE] space-y-1">
            <p className="line-clamp-2 text-white/90 font-light">{movie.description}</p>
            <div className="flex items-center justify-between text-white/70 pt-1 border-t border-white/10">
              <span>{movie.category}</span>
              <span>{movie.duration}</span>
            </div>
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start pointer-events-none">
          {movie.isDubbed ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#173B2B]/90 text-[#E2C766] border border-[#C9A227]/40 backdrop-blur-sm shadow">
              Dubbed
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#08130D]/80 text-[#A9B8AE] backdrop-blur-sm">
              {movie.language}
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavourite(movie.id);
            }}
            className={`pointer-events-auto p-1.5 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
              isFav 
                ? 'bg-[#173B2B]/90 text-[#C9A227] border border-[#C9A227]/50' 
                : 'bg-black/30 text-white/80 hover:text-[#C9A227]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Watched Badge */}
        {(movie.watched || isWatchedView) && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-[#527A52]/90 text-white text-[10px] font-medium flex items-center gap-1 shadow backdrop-blur-sm">
            <Eye className="w-3 h-3" /> Watched
          </div>
        )}
      </div>

      {/* Card Information */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm text-[#FFFDF7] light:text-[#173B2B] truncate group-hover:text-[#C9A227] transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-[#A9B8AE] light:text-[#527A52] mt-1">
            <span>{movie.year}</span>
            <span>•</span>
            <span className="truncate">{movie.genre || movie.category}</span>
          </div>
        </div>

        {/* Watch progress bar if applicable */}
        {movie.watchProgress > 0 && (
          <div className="mt-2.5">
            <div className="h-1 w-full bg-[#10251A] light:bg-[#E6E0D2] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#527A52] to-[#C9A227] rounded-full" 
                style={{ width: `${movie.watchProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
