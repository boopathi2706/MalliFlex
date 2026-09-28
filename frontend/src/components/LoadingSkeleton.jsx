import React from 'react';

export const LoadingSkeleton = ({ type = 'cards', count = 5 }) => {
  if (type === 'hero') {
    return (
      <div className="w-full h-[70vh] bg-[#10251A] animate-pulse rounded-2xl relative overflow-hidden my-4">
        <div className="absolute bottom-12 left-8 max-w-lg space-y-4">
          <div className="h-6 w-32 bg-[#173B2B] rounded-full" />
          <div className="h-12 w-3/4 bg-[#173B2B] rounded-lg" />
          <div className="h-4 w-1/2 bg-[#173B2B] rounded" />
          <div className="h-10 w-40 bg-[#173B2B] rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="rounded-xl bg-[#142B20] border border-[#173B2B]/40 p-3 space-y-3 animate-pulse">
          <div className="aspect-[2/3] w-full bg-[#10251A] rounded-lg" />
          <div className="h-4 bg-[#173B2B] rounded w-3/4" />
          <div className="h-3 bg-[#173B2B] rounded w-1/2" />
        </div>
      ))}
    </div>
  );
};
