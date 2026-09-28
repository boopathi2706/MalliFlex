import React from 'react';
import { useApp } from '../context/AppContext';
import { MovieGrid } from '../components/MovieGrid';
import { EmptyState } from '../components/EmptyState';
import { Search as SearchIcon } from 'lucide-react';

export const SearchPage = () => {
  const { movies, searchQuery, setSearchQuery } = useApp();

  const filteredMovies = searchQuery.trim() === ''
    ? movies
    : movies.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen">
      {/* Mobile / Full search header input */}
      <div className="mb-8">
        <div className="relative max-w-xl mb-6">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C9A227]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, genre, language (e.g. Leo, Tamil, Action)..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#10251A] light:bg-[#F8F4E8] border border-[#2F5D3A] light:border-[#E6E0D2] text-[#FFFDF7] light:text-[#173B2B] text-sm focus:outline-none focus:border-[#C9A227] transition-all shadow-inner"
          />
        </div>

        <h1 className="font-serif-display text-2xl sm:text-3xl font-extrabold text-[#FFFDF7] light:text-[#173B2B]">
          {searchQuery.trim() ? `Search results for "${searchQuery}"` : 'All Movies Search'}
        </h1>
        <p className="text-xs sm:text-sm text-[#A9B8AE] light:text-[#527A52] mt-1">
          Found {filteredMovies.length} matching movies
        </p>
      </div>

      {filteredMovies.length > 0 ? (
        <MovieGrid movies={filteredMovies} />
      ) : (
        <EmptyState type="search" query={searchQuery} />
      )}
    </div>
  );
};
