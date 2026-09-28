import React from 'react';
import { useApp } from '../context/AppContext';
import { MovieGrid } from '../components/MovieGrid';
import { EmptyState } from '../components/EmptyState';
import { Heart, Sparkles } from 'lucide-react';

export const Favourites = () => {
  const { movies, favourites } = useApp();

  const favMovies = movies.filter(m => favourites.includes(m.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 rounded-2xl bg-[#173B2B] light:bg-[#F8F4E8] border border-[#C9A227]/40 text-[#C9A227]">
          <Heart className="w-7 h-7 fill-current" />
        </div>
        <div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-[#FFFDF7] light:text-[#173B2B]">
            My Favourites
          </h1>
          <p className="text-sm text-[#A9B8AE] light:text-[#527A52] flex items-center gap-1.5 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            Your personal curated movie collection ({favMovies.length})
          </p>
        </div>
      </div>

      {favMovies.length > 0 ? (
        <MovieGrid movies={favMovies} />
      ) : (
        <EmptyState type="favourites" />
      )}
    </div>
  );
};
