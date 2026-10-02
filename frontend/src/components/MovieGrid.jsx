import React, { useState } from 'react';
import { MovieCard } from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const MovieGrid = ({ movies, isWatchedView = false, itemsPerPage = 20 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!movies || movies.length === 0) return null;

  const totalPages = Math.ceil(movies.length / itemsPerPage);
  const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const currentMovies = movies.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers for pagination bar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, validCurrentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-8">
      {/* Movie Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {currentMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} isWatchedView={isWatchedView} />
        ))}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#173B2B]/60 light:border-[#E6E0D2]">
          <p className="text-xs text-[#A9B8AE]">
            Showing <span className="font-semibold text-[#FFFDF7]">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-[#FFFDF7]">{Math.min(startIndex + itemsPerPage, movies.length)}</span> of{' '}
            <span className="font-semibold text-[#C9A227]">{movies.length}</span> movies
          </p>

          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(validCurrentPage - 1)}
              disabled={validCurrentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-[#10251A] light:bg-[#F8F4E8] text-xs font-semibold text-[#FFFDF7] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#173B2B] border border-[#2F5D3A]/40 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>

            {/* First Page button if distant */}
            {getPageNumbers()[0] > 1 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className="px-3 py-1.5 rounded-lg bg-[#10251A] text-xs font-semibold text-[#A9B8AE] hover:text-white border border-[#2F5D3A]/40"
                >
                  1
                </button>
                {getPageNumbers()[0] > 2 && <span className="text-[#A9B8AE] px-1 text-xs">...</span>}
              </>
            )}

            {/* Numbered Page Buttons */}
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  validCurrentPage === page
                    ? 'bg-[#C9A227] text-[#08130D] shadow-md border border-[#C9A227]'
                    : 'bg-[#10251A] light:bg-[#F8F4E8] text-[#A9B8AE] hover:text-[#FFFDF7] border border-[#2F5D3A]/40 hover:bg-[#173B2B]'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Last Page button if distant */}
            {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
              <>
                {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                  <span className="text-[#A9B8AE] px-1 text-xs">...</span>
                )}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-3 py-1.5 rounded-lg bg-[#10251A] text-xs font-semibold text-[#A9B8AE] hover:text-white border border-[#2F5D3A]/40"
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(validCurrentPage + 1)}
              disabled={validCurrentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-[#10251A] light:bg-[#F8F4E8] text-xs font-semibold text-[#FFFDF7] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#173B2B] border border-[#2F5D3A]/40 transition-colors flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
