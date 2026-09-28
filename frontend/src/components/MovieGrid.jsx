import React from 'react';
import { MovieCard } from './MovieCard';

export const MovieGrid = ({ movies, isWatchedView = false }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} isWatchedView={isWatchedView} />
      ))}
    </div>
  );
};
