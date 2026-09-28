const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'admin'], default: 'client' },
  favourites: [{ type: String }] // Stores Movie IDs or Mongo ObjectIds
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
