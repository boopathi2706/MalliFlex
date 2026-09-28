import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Film, Image, Video, Globe, Tag, Calendar, Clock, Plus, Save } from 'lucide-react';

export const MovieForm = ({ mode = 'add' }) => {
  const { addMovie, editMovie, selectedMovie, setActiveTab } = useApp();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    posterUrl: '',
    videoUrl: '',
    backdropUrl: '',
    language: 'Tamil',
    category: 'Action',
    genre: 'Action / Drama',
    year: new Date().getFullYear(),
    duration: '2h 15m'
  });

  useEffect(() => {
    if (mode === 'edit' && selectedMovie) {
      setFormData(selectedMovie);
    }
  }, [mode, selectedMovie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'edit') {
        await editMovie(formData);
      } else {
        await addMovie(formData);
      }
      setActiveTab('admin-dashboard');
    } catch (err) {
      console.error("Error submitting movie form:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen">
      {/* Header & Back Button */}
      <button
        onClick={() => setActiveTab('admin-dashboard')}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#A9B8AE] hover:text-[#FFFDF7] mb-6"
      >
        <ArrowLeft className="w-4 h-4 text-[#C9A227]" /> Back to Dashboard
      </button>

      <div className="bg-[#10251A] light:bg-white border border-[#2F5D3A]/60 light:border-[#E6E0D2] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        <div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-extrabold text-[#FFFDF7] light:text-[#173B2B]">
            {mode === 'edit' ? 'Edit Movie Details' : 'Add New Movie'}
          </h1>
          <p className="text-xs sm:text-sm text-[#A9B8AE] light:text-[#527A52] mt-1">
            Fill in the details below to update your streaming platform library
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-semibold text-[#A9B8AE]">Movie Name / Title *</label>
              <div className="relative">
                <Film className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A227]" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Leo"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#08130D] light:bg-[#F8F4E8] border border-[#173B2B] light:border-[#E6E0D2] text-sm text-[#FFFDF7] light:text-[#173B2B] focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>

            {/* Poster URL */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#A9B8AE]">Poster Image URL *</label>
              <div className="relative">
                <Image className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A227]" />
                <input
                  type="url"
                  name="posterUrl"
                  value={formData.posterUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#08130D] light:bg-[#F8F4E8] border border-[#173B2B] light:border-[#E6E0D2] text-sm text-[#FFFDF7] light:text-[#173B2B] focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>

            {/* Video URL */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#A9B8AE]">Video / Cloud Stream URL *</label>
              <div className="relative">
                <Video className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A227]" />
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#08130D] light:bg-[#F8F4E8] border border-[#173B2B] light:border-[#E6E0D2] text-sm text-[#FFFDF7] light:text-[#173B2B] focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#A9B8AE]">Language *</label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A227]" />
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="e.g. Tamil or English (Tamil Dubbed)"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#08130D] light:bg-[#F8F4E8] border border-[#173B2B] light:border-[#E6E0D2] text-sm text-[#FFFDF7] light:text-[#173B2B] focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#A9B8AE]">Category *</label>
              <div className="relative">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A227]" />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#08130D] light:bg-[#F8F4E8] border border-[#173B2B] light:border-[#E6E0D2] text-sm text-[#FFFDF7] light:text-[#173B2B] focus:outline-none focus:border-[#C9A227]"
                >
                  <option value="Action">Action</option>
                  <option value="Drama">Drama</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Biography">Biography</option>
                </select>
              </div>
            </div>

            {/* Year */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#A9B8AE]">Release Year</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A227]" />
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="2024"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#08130D] light:bg-[#F8F4E8] border border-[#173B2B] light:border-[#E6E0D2] text-sm text-[#FFFDF7] light:text-[#173B2B] focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#A9B8AE]">Duration</label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A227]" />
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 2h 45m"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#08130D] light:bg-[#F8F4E8] border border-[#173B2B] light:border-[#E6E0D2] text-sm text-[#FFFDF7] light:text-[#173B2B] focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-semibold text-[#A9B8AE]">Movie Description *</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter plot summary..."
                required
                className="w-full p-4 rounded-xl bg-[#08130D] light:bg-[#F8F4E8] border border-[#173B2B] light:border-[#E6E0D2] text-sm text-[#FFFDF7] light:text-[#173B2B] focus:outline-none focus:border-[#C9A227]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-[#173B2B] light:border-[#E6E0D2]">
            <button
              type="button"
              onClick={() => setActiveTab('admin-dashboard')}
              className="px-6 py-3 rounded-full text-sm font-semibold text-[#A9B8AE] hover:text-[#FFFDF7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-full bg-[#C9A227] hover:bg-[#E2C766] text-[#08130D] font-bold text-sm flex items-center gap-2 shadow-xl active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                mode === 'edit' ? 'Saving Changes...' : 'Adding Movie...'
              ) : (
                <>
                  {mode === 'edit' ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4 stroke-[3]" />}
                  {mode === 'edit' ? 'Save Changes' : 'Add Movie'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
