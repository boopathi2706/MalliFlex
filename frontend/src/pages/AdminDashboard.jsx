import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Film, Clapperboard, Heart, Eye, Languages, 
  Plus, Edit, Trash2, ArrowLeft, Search 
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const AdminDashboard = () => {
  const { movies, favourites, deleteMovie, setActiveTab, setSelectedMovie } = useApp();
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');

  // Statistics calculation
  const totalMovies = movies.length;
  const tamilMovies = movies.filter(m => m.language.toLowerCase().includes('tamil') && !m.isDubbed).length;
  const dubbedMovies = movies.filter(m => m.isDubbed).length;
  const totalFavourites = favourites.length;
  const watchedMovies = movies.filter(m => m.watched).length;

  const filteredMovies = movies.filter(m =>
    m.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    m.language.toLowerCase().includes(filterQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const stats = [
    { title: 'Total Movies', value: totalMovies, icon: Film, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { title: 'Tamil Movies', value: tamilMovies, icon: Clapperboard, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { title: 'Dubbed Movies', value: dubbedMovies, icon: Languages, color: 'text-sky-400', bg: 'bg-sky-400/10' },
    { title: 'Favourite Movies', value: totalFavourites, icon: Heart, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    { title: 'Watched Movies', value: watchedMovies, icon: Eye, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  ];

  const handleEdit = (movie) => {
    setSelectedMovie(movie);
    setActiveTab('admin-edit');
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      deleteMovie(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-[#FFFDF7] light:text-[#173B2B]">
            Admin Control Center
          </h1>
          <p className="text-sm text-[#A9B8AE] light:text-[#527A52] mt-1">
            Manage your Malli Flix streaming catalog, movie URLs, and metadata
          </p>
        </div>

        <button
          onClick={() => setActiveTab('admin-add')}
          className="px-5 py-2.5 rounded-full bg-[#C9A227] hover:bg-[#E2C766] text-[#08130D] font-bold text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add New Movie
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#10251A] light:bg-white border border-[#2F5D3A]/50 light:border-[#E6E0D2] shadow-md flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#A9B8AE] light:text-[#527A52]">{stat.title}</span>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#FFFDF7] light:text-[#173B2B]">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Movie Management Table Header */}
      <div className="bg-[#10251A] light:bg-white border border-[#2F5D3A]/50 light:border-[#E6E0D2] rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[#173B2B] light:border-[#E6E0D2] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-[#FFFDF7] light:text-[#173B2B] flex items-center gap-2">
            <Film className="w-5 h-5 text-[#C9A227]" />
            Movie Catalog Management
          </h2>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A227]" />
            <input
              type="text"
              placeholder="Filter catalog..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#08130D] light:bg-[#F8F4E8] border border-[#173B2B] text-xs text-[#FFFDF7] light:text-[#173B2B] focus:outline-none focus:border-[#C9A227]"
            />
          </div>
        </div>

        {/* Table for Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm text-[#A9B8AE] light:text-[#527A52]">
            <thead className="bg-[#08130D]/80 light:bg-[#F8F4E8] text-xs uppercase font-semibold text-[#FFFDF7] light:text-[#173B2B] border-b border-[#173B2B] light:border-[#E6E0D2]">
              <tr>
                <th className="px-6 py-4">Poster</th>
                <th className="px-6 py-4">Movie Name</th>
                <th className="px-6 py-4">Language</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#173B2B]/40 light:divide-[#E6E0D2]">
              {filteredMovies.map((movie) => (
                <tr key={movie.id} className="hover:bg-[#142B20]/50 light:hover:bg-[#F8F4E8]/50 transition-colors">
                  <td className="px-6 py-3">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-10 h-14 object-cover rounded-lg border border-[#173B2B]"
                    />
                  </td>
                  <td className="px-6 py-3 font-semibold text-[#FFFDF7] light:text-[#173B2B]">
                    {movie.title}
                  </td>
                  <td className="px-6 py-3">{movie.language}</td>
                  <td className="px-6 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#173B2B] text-[#E2C766]">
                      {movie.category}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs">{movie.createdDate || '2024-01-01'}</td>
                  <td className="px-6 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(movie)}
                      className="p-2 rounded-lg bg-[#173B2B] hover:bg-[#2F5D3A] text-[#C9A227] transition-colors"
                      title="Edit Movie"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(movie.id)}
                      className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 transition-colors"
                      title="Delete Movie"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Responsive Mobile Cards for Admin */}
        <div className="md:hidden p-4 space-y-4">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="p-3 rounded-xl bg-[#08130D] light:bg-[#F8F4E8] border border-[#173B2B] flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-12 h-16 object-cover rounded-lg shrink-0"
                />
                <div>
                  <h4 className="font-semibold text-sm text-[#FFFDF7] light:text-[#173B2B]">{movie.title}</h4>
                  <p className="text-xs text-[#A9B8AE]">{movie.language} • {movie.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(movie)}
                  className="p-2 rounded-lg bg-[#173B2B] text-[#C9A227]"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTargetId(movie.id)}
                  className="p-2 rounded-lg bg-rose-900/40 text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Movie?"
        message="Are you sure you want to remove this movie? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
