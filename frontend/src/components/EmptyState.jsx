import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Search, Film, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const EmptyState = ({ type = 'search', query = '' }) => {
  const { setActiveTab } = useApp();

  const configs = {
    search: {
      icon: Search,
      title: 'No movies found',
      subtitle: query ? `We couldn't find any movies matching "${query}".` : 'Try searching with another movie name or language.',
      actionText: 'Browse All Movies',
      action: () => setActiveTab('movies')
    },
    favourites: {
      icon: Heart,
      title: 'Your favourites are waiting',
      subtitle: 'Add movies you love to build your personal streaming collection.',
      actionText: 'Explore Movies',
      action: () => setActiveTab('movies')
    },
    watched: {
      icon: CheckCircle2,
      title: 'No watched movies yet',
      subtitle: 'Movies you watch will automatically be saved here so you can rewatch anytime.',
      actionText: 'Start Watching',
      action: () => setActiveTab('home')
    },
    general: {
      icon: Film,
      title: 'No movies available',
      subtitle: 'Check back soon for new movie additions to the catalog.',
      actionText: 'Return Home',
      action: () => setActiveTab('home')
    }
  };

  const current = configs[type] || configs.general;
  const IconComponent = current.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-md mx-auto"
    >
      {/* Subtle Jasmine Flower / Icon Decoration */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-[#10251A] light:bg-[#F8F4E8] border border-[#2F5D3A]/40 flex items-center justify-center shadow-xl">
          <IconComponent className="w-9 h-9 text-[#C9A227]" />
        </div>
        <div className="absolute -top-1 -right-1">
          <Sparkles className="w-5 h-5 text-[#E2C766] animate-pulse" />
        </div>
      </div>

      <h3 className="font-serif-display text-2xl font-bold text-[#FFFDF7] light:text-[#173B2B] mb-2">
        {current.title}
      </h3>
      <p className="text-sm text-[#A9B8AE] light:text-[#527A52] leading-relaxed mb-6 font-light">
        {current.subtitle}
      </p>

      {current.actionText && (
        <button
          onClick={current.action}
          className="px-6 py-2.5 rounded-full bg-[#173B2B] hover:bg-[#2F5D3A] light:bg-[#F8F4E8] light:hover:bg-[#E6E0D2] text-[#FFFDF7] light:text-[#173B2B] border border-[#C9A227]/40 text-sm font-semibold transition-all shadow-md"
        >
          {current.actionText}
        </button>
      )}
    </motion.div>
  );
};
