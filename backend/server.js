const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Movie = require('./models/Movie');
const User = require('./models/User');
const INITIAL_SEED_MOVIES = require('./seedData');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/malliflix';

app.use(cors());
app.use(express.json());

// Fallback in-memory store if local MongoDB service is not running
let isMongoConnected = false;
let inMemoryMovies = [...INITIAL_SEED_MOVIES].map((m, idx) => ({ ...m, _id: `m_${idx + 1}` }));
let inMemoryFavourites = [`m_1`, `m_3`, `m_6`];


// Connect to MongoDB
mongoose.connect(MONGODB_URI)

  .then(async () => {
    isMongoConnected = true;
    console.log('Successfully connected to MongoDB Database!');
    
    // Seed database if empty
    const count = await Movie.countDocuments();
    if (count === 0) {
      console.log('Seeding initial movies into MongoDB...');
      await Movie.insertMany(INITIAL_SEED_MOVIES);
      console.log('MongoDB successfully seeded with movies!');
    }
  })
  .catch((err) => {
    console.warn('MongoDB connection failed/unavailable:', err.message);
    console.warn('Fallback: Running in-memory database store with live API functionality.');
  });

// Helper to normalize MongoDB document output for frontend compatibility
const formatMovie = (doc) => {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    id: obj._id ? obj._id.toString() : obj.id
  };
};

// --- AUTH API ---
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const role = username === 'admin@husband' ? 'admin' : 'client';
  
  if (isMongoConnected) {
    try {
      let user = await User.findOne({ username });
      if (!user) {
        user = await User.create({ username, password: password || 'password', role, favourites: [] });
      }
      return res.json({
        success: true,
        user: { username: user.username, role: user.role },
        token: `jwt-token-${user._id}`
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Fallback memory
  return res.json({
    success: true,
    user: { username: username || 'wife', role },
    token: 'mock-jwt-token'
  });
});

// --- MOVIES API ---
app.get('/api/movies', async (req, res) => {
  if (isMongoConnected) {
    try {
      const movies = await Movie.find().sort({ createdAt: -1 });
      return res.json(movies.map(formatMovie));
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  res.json(inMemoryMovies.map(m => ({ ...m, id: m._id })));
});

app.post('/api/movies', async (req, res) => {
  const movieData = {
    ...req.body,
    backdropUrl: req.body.backdropUrl || req.body.posterUrl,
    genre: req.body.genre || `${req.body.category || 'Action'} / Drama`,
    createdDate: new Date().toISOString().split('T')[0],
    watched: false,
    watchProgress: 0,
    isTrending: false,
    isDubbed: req.body.language ? req.body.language.toLowerCase().includes('dubbed') : false
  };


  if (isMongoConnected) {
    try {
      const created = await Movie.create(movieData);
      return res.status(201).json(formatMovie(created));
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  const createdMemory = { ...movieData, _id: `m_${Date.now()}`, id: `m_${Date.now()}` };
  inMemoryMovies.unshift(createdMemory);
  res.status(201).json(createdMemory);
});

app.put('/api/movies/:id', async (req, res) => {
  const { id } = req.params;

  if (isMongoConnected) {
    try {
      const updated = await Movie.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: "Movie not found" });
      return res.json(formatMovie(updated));
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  const idx = inMemoryMovies.findIndex(m => m._id === id || m.id === id);
  if (idx !== -1) {
    inMemoryMovies[idx] = { ...inMemoryMovies[idx], ...req.body };
    return res.json({ ...inMemoryMovies[idx], id: inMemoryMovies[idx]._id });
  }
  res.status(404).json({ message: "Movie not found" });
});

app.delete('/api/movies/:id', async (req, res) => {
  const { id } = req.params;

  if (isMongoConnected) {
    try {
      await Movie.findByIdAndDelete(id);
      return res.json({ message: "Movie deleted successfully", id });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  inMemoryMovies = inMemoryMovies.filter(m => m._id !== id && m.id !== id);
  inMemoryFavourites = inMemoryFavourites.filter(favId => favId !== id);
  res.json({ message: "Movie deleted successfully", id });
});

// --- FAVOURITES API ---
app.get('/api/favourites', async (req, res) => {
  if (isMongoConnected) {
    try {
      const user = await User.findOne({ username: 'wife' });
      return res.json(user ? user.favourites : []);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  res.json(inMemoryFavourites);
});

app.post('/api/favourites/toggle', async (req, res) => {
  const { movieId } = req.body;

  if (isMongoConnected) {
    try {
      let user = await User.findOne({ username: 'wife' });
      if (!user) {
        user = await User.create({ username: 'wife', password: 'password', role: 'client', favourites: [] });
      }
      
      const isFav = user.favourites.includes(movieId);
      if (isFav) {
        user.favourites = user.favourites.filter(id => id !== movieId);
      } else {
        user.favourites.push(movieId);
      }
      await user.save();
      return res.json({ favourites: user.favourites, isFav: !isFav });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  const isFav = inMemoryFavourites.includes(movieId);
  if (isFav) {
    inMemoryFavourites = inMemoryFavourites.filter(id => id !== movieId);
  } else {
    inMemoryFavourites.push(movieId);
  }
  res.json({ favourites: inMemoryFavourites, isFav: !isFav });
});

// --- WATCHED API ---
app.post('/api/movies/:id/watch', async (req, res) => {
  const { id } = req.params;

  if (isMongoConnected) {
    try {
      const movie = await Movie.findById(id);
      if (movie) {
        movie.watched = true;
        movie.watchProgress = movie.watchProgress || 20;
        await movie.save();
        return res.json(formatMovie(movie));
      }
      return res.status(404).json({ message: "Movie not found" });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  const idx = inMemoryMovies.findIndex(m => m._id === id || m.id === id);
  if (idx !== -1) {
    inMemoryMovies[idx].watched = true;
    inMemoryMovies[idx].watchProgress = inMemoryMovies[idx].watchProgress || 20;
    return res.json({ ...inMemoryMovies[idx], id: inMemoryMovies[idx]._id });
  }
  res.status(404).json({ message: "Movie not found" });
});

app.listen(PORT, () => {
  console.log(`Malli Flix Backend API running on port ${PORT}`);
});
