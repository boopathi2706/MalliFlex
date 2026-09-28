import React from 'react';
import { useApp } from '../context/AppContext';
import { HeroSection } from '../components/HeroSection';
import { MovieRow } from '../components/MovieRow';
import { MovieGrid } from '../components/MovieGrid';
import { EmptyState } from '../components/EmptyState';

export const Home = () => {
  const { movies, activeTab } = useApp();

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

  // Home Default View
  return (
    <div className="space-y-4 pb-20">
      {/* Featured Hero */}
      <HeroSection movie={heroMovie} />

      {/* Movie Rows */}
      <div className="-mt-10 relative z-20 space-y-4">
        <MovieRow
          title="Trending Now"
          subtitle="Most watched blockbusters this week"
          movies={trendingMovies}
        />

        <MovieRow
          title="Tamil Movies"
          subtitle="Top Kollywood releases & action dramas"
          movies={tamilMovies}
        />

        {watchedMovies.length > 0 && (
          <MovieRow
            title="Continue Watching"
            subtitle="Pick up right where you left off"
            movies={watchedMovies}
          />
        )}

        <MovieRow
          title="Tamil Dubbed Movies"
          subtitle="International cinema with Tamil audio"
          movies={dubbedMovies}
        />
      </div>
    </div>
  );
};
