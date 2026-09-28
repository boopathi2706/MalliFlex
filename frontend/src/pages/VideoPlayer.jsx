import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Film, Globe, Clock, Calendar, Sparkles } from 'lucide-react';

export const VideoPlayer = () => {
  const { selectedMovie, setActiveTab } = useApp();

  if (!selectedMovie) return null;

  return (
    <div className="min-h-screen bg-[#050B07] text-[#FFFDF7] pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveTab('details')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10251A] hover:bg-[#173B2B] text-sm font-semibold text-[#A9B8AE] hover:text-[#FFFDF7] border border-[#2F5D3A]/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#C9A227]" /> Back to Details
          </button>
          
          <div className="flex items-center gap-2 text-xs font-mono text-[#C9A227]">
            <Sparkles className="w-4 h-4" /> Malli Flix Cinema HD
          </div>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#173B2B] shadow-2xl">
          <video
            src={selectedMovie.videoUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
            poster={selectedMovie.backdropUrl || selectedMovie.posterUrl}
          >
            Your browser does not support HTML video play back.
          </video>
        </div>

        {/* Movie Info Below Video */}
        <div className="p-6 rounded-2xl bg-[#10251A] border border-[#173B2B] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-serif-display text-2xl sm:text-3xl font-extrabold text-[#FFFDF7]">
              {selectedMovie.title}
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#173B2B] text-[#E2C766] border border-[#C9A227]/40">
              {selectedMovie.category}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#A9B8AE]">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#C9A227]" /> {selectedMovie.year}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#C9A227]" /> {selectedMovie.duration}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-[#C9A227]" /> {selectedMovie.language}</span>
          </div>

          <p className="text-sm text-[#A9B8AE] leading-relaxed font-light pt-2 border-t border-[#173B2B]">
            {selectedMovie.description}
          </p>
        </div>

      </div>
    </div>
  );
};
