import React from 'react';
import { useApp } from '../context/AppContext';
import { MovieRow } from '../components/MovieRow';
import { Play, Heart, ArrowLeft, Calendar, Clock, Globe, Film, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const MovieDetails = () => {
  const { selectedMovie, movies, favourites, toggleFavourite, playMovie, setActiveTab } = useApp();

  if (!selectedMovie) return null;

  const isFav = favourites.includes(selectedMovie.id);
  const relatedMovies = movies.filter(m => m.id !== selectedMovie.id && (m.category === selectedMovie.category || m.language === selectedMovie.language));

  return (
    <div className="pb-24 pt-16">
      {/* Back button header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => setActiveTab('home')}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#A9B8AE] hover:text-[#FFFDF7] light:hover:text-[#173B2B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#C9A227]" /> Back to Movies
        </button>
      </div>

      {/* Hero Backdrop Banner */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] overflow-hidden">
        <img
          src={selectedMovie.backdropUrl || selectedMovie.posterUrl}
          alt={selectedMovie.title}
          className="w-full h-full object-cover filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08130D] via-[#08130D]/70 to-transparent" />
      </div>

      {/* Main Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 sm:-mt-48 relative z-10">
        <div className="flex flex-col md:flex-row items-start gap-8">
          
          {/* Movie Poster Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-48 sm:w-64 shrink-0 rounded-2xl overflow-hidden border-2 border-[#173B2B] light:border-[#E6E0D2] shadow-2xl bg-[#142B20]"
          >
            <img
              src={selectedMovie.posterUrl}
              alt={selectedMovie.title}
              className="w-full aspect-[2/3] object-cover"
            />
          </motion.div>

          {/* Details Content Right */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#173B2B] text-[#E2C766] border border-[#C9A227]/40">
                {selectedMovie.category}
              </span>
              {selectedMovie.isDubbed && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40">
                  Dubbed
                </span>
              )}
            </div>

            <h1 className="font-serif-display text-3xl sm:text-5xl font-extrabold text-[#FFFDF7] light:text-[#173B2B]">
              {selectedMovie.title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#A9B8AE] light:text-[#527A52]">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#C9A227]" /> {selectedMovie.year}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#C9A227]" /> {selectedMovie.duration}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-[#C9A227]" /> {selectedMovie.language}</span>
            </div>

            <p className="text-sm sm:text-base text-[#A9B8AE] light:text-[#527A52] leading-relaxed font-light max-w-3xl pt-2">
              {selectedMovie.description}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center flex-wrap gap-4 pt-4">
              <button
                onClick={() => playMovie(selectedMovie)}
                className="px-8 py-3.5 rounded-full bg-[#C9A227] hover:bg-[#E2C766] text-[#08130D] font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl transition-all active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" /> Watch Now
              </button>

              <button
                onClick={() => toggleFavourite(selectedMovie.id)}
                className={`px-6 py-3.5 rounded-full font-semibold text-sm sm:text-base flex items-center gap-2 border transition-colors ${
                  isFav
                    ? 'bg-[#173B2B] text-[#C9A227] border-[#C9A227]'
                    : 'bg-[#10251A] text-[#FFFDF7] light:text-[#173B2B] border-[#2F5D3A] hover:bg-[#173B2B]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-current text-[#C9A227]' : ''}`} />
                {isFav ? 'In Favourites' : 'Add to Favourites'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* More Like This */}
        {relatedMovies.length > 0 && (
          <div className="mt-20 pt-10 border-t border-[#173B2B] light:border-[#E6E0D2]">
            <MovieRow title="More Like This" subtitle="Similar titles you might enjoy" movies={relatedMovies} />
          </div>
        )}
      </div>
    </div>
  );
};
