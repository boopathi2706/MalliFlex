const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  language: { type: String, required: true, default: 'Tamil' },
  category: { type: String, required: true, default: 'Action' },
  genre: { type: String, default: 'Action / Drama' },
  year: { type: Number, default: () => new Date().getFullYear() },
  duration: { type: String, default: '2h 00m' },
  posterUrl: { type: String, required: true },
  backdropUrl: { type: String, default: '' },
  videoUrl: { type: String, required: true },
  createdDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  isTrending: { type: Boolean, default: false },
  isDubbed: { type: Boolean, default: false },
  watched: { type: Boolean, default: false },
  watchProgress: { type: Number, default: 0 }
}, { timestamps: true });


module.exports = mongoose.model('Movie', movieSchema);
