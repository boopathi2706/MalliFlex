import React from 'react';
import { useApp } from '../context/AppContext';
import { HeroSection } from '../components/HeroSection';
import { MovieRow } from '../components/MovieRow';
import { MovieGrid } from '../components/MovieGrid';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const Home = () => {
  const { movies, activeTab, loadingMovies, movieError, loadingDetail } = useApp();

  if (loadingMovies) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
        <div className="inline-flex items-center gap-3 text-[#C9A227] text-lg font-semibold animate-pulse">
          <div className="w-5 h-5 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
          Loading movies...
        </div>
        <LoadingSkeleton type="hero" />
        <LoadingSkeleton type="cards" count={6} />
      </div>
    );
  }

  if (movieError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="p-8 rounded-2xl bg-[#10251A] border border-[#173B2B] max-w-md mx-auto space-y-4">
          <p className="text-rose-400 font-semibold text-base">{movieError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-full bg-[#C9A227] text-[#08130D] font-bold text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return <EmptyState type="general" />;
  }

  // Filtered lists
  const heroMovie = movies.find(m => m.isTrending) || movies[0];
  const trendingMovies = movies.filter(m => m.isTrending);
  const tamilMovies = movies.filter(m => m.language.toLowerCase().includes('tamil') && !m.isDubbed);
  const dubbedMovies = movies.filter(m => m.isDubbed);
  const watchedMovies = movies.filter(m => m.watched);

  // Tab specific content
  if (activeTab === 'movies') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-8">
          <h1 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-[#FFFDF7] light:text-[#173B2B] mb-2">
            All Movies
          </h1>
          <p className="text-sm text-[#A9B8AE] light:text-[#527A52]">
            Explore our entire library of films & cinema classics
          </p>
        </div>
        <MovieGrid movies={movies} />
      </div>
    );
  }

  if (activeTab === 'tamil') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-8">
          <h1 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-[#FFFDF7] light:text-[#173B2B] mb-2">
            Tamil Movies
          </h1>
          <p className="text-sm text-[#A9B8AE] light:text-[#527A52]">
            Pure Kollywood cinema hits and blockbusters
          </p>
        </div>
        {tamilMovies.length > 0 ? (
          <MovieGrid movies={tamilMovies} />
        ) : (
          <EmptyState type="general" />
        )}
      </div>
    );
  }

  if (activeTab === 'dubbed') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-8">
          <h1 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-[#FFFDF7] light:text-[#173B2B] mb-2">
            Tamil Dubbed Movies
          </h1>
          <p className="text-sm text-[#A9B8AE] light:text-[#527A52]">
            Global blockbusters dubbed in high-quality Tamil audio
          </p>
        </div>
        {dubbedMovies.length > 0 ? (
          <MovieGrid movies={dubbedMovies} />
        ) : (
          <EmptyState type="general" />
        )}
      </div>
    );
  }

  // Home Default View: Paginated Grid with Search Header
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pb-20 space-y-8">
      {/* Featured Hero */}
      {heroMovie && <HeroSection movie={heroMovie} />}

      {/* Header section with title and movie count */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[#173B2B]/60">
        <div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-[#FFFDF7] light:text-[#173B2B]">
            All Movies Catalog
          </h1>
          <p className="text-sm text-[#A9B8AE] light:text-[#527A52] mt-1">
            Browse our catalog of {movies.length} movies (20 movies per page)
          </p>
        </div>
      </div>

      {/* Paginated Grid of 20 movies per page */}
      <MovieGrid movies={movies} itemsPerPage={20} />
    </div>
  );
};
