import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
const API_BASE = 'http://localhost:5000/api';

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('malli_theme') || 'dark';
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('malli_user');
    return savedUser ? JSON.parse(savedUser) : { username: 'wife', role: 'client' };
  });

  // State populated completely from backend API
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);

  const [activeTab, setActiveTab] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Sync theme
  useEffect(() => {
    localStorage.setItem('malli_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Sync user state
  useEffect(() => {
    if (user) {
      localStorage.setItem('malli_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('malli_user');
    }
  }, [user]);

  // Fetch Movies from Backend
  const fetchMovies = async () => {
    try {
      setLoadingMovies(true);
      const res = await fetch(`${API_BASE}/movies`);
      if (res.ok) {
        const data = await res.json();
        setMovies(data);
      }
    } catch (err) {
      console.error('Error fetching movies from backend:', err);
    } finally {
      setLoadingMovies(false);
    }
  };

  // Fetch Favourites from Backend
  const fetchFavourites = async () => {
    try {
      const res = await fetch(`${API_BASE}/favourites`);
      if (res.ok) {
        const data = await res.json();
        setFavourites(data);
      }
    } catch (err) {
      console.error('Error fetching favourites from backend:', err);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchFavourites();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // API Call: Toggle Favourite
  const toggleFavourite = async (movieId) => {
    try {
      const res = await fetch(`${API_BASE}/favourites/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId })
      });
      if (res.ok) {
        const data = await res.json();
        setFavourites(data.favourites);
        showToast(data.isFav ? 'Added to favourites' : 'Removed from favourites');
      }
    } catch (err) {
      console.error('Error toggling favourite:', err);
    }
  };

  // API Call: Add Movie
  const addMovie = async (newMovie) => {
    try {
      const res = await fetch(`${API_BASE}/movies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie)
      });
      if (res.ok) {
        const created = await res.json();
        setMovies(prev => [created, ...prev]);
        showToast('Movie added successfully');
      }
    } catch (err) {
      console.error('Error adding movie:', err);
    }
  };

  // API Call: Edit Movie
  const editMovie = async (updatedMovie) => {
    try {
      const res = await fetch(`${API_BASE}/movies/${updatedMovie.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMovie)
      });
      if (res.ok) {
        const updated = await res.json();
        setMovies(prev => prev.map(m => m.id === updated.id ? updated : m));
        showToast('Movie updated successfully');
      }
    } catch (err) {
      console.error('Error updating movie:', err);
    }
  };

  // API Call: Delete Movie
  const deleteMovie = async (movieId) => {
    try {
      const res = await fetch(`${API_BASE}/movies/${movieId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMovies(prev => prev.filter(m => m.id !== movieId));
        setFavourites(prev => prev.filter(id => id !== movieId));
        showToast('Movie deleted successfully');
      }
    } catch (err) {
      console.error('Error deleting movie:', err);
    }
  };

  // API Call: Login User
  const loginUser = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.user.role === 'admin') {
          setActiveTab('admin-dashboard');
          showToast('Welcome back, Admin!');
        } else {
          setActiveTab('home');
          showToast('Welcome back to Malli Flix!');
        }
      }
    } catch (err) {
      console.error('Error logging in:', err);
    }
  };

  const logoutUser = () => {
    setUser(null);
    showToast('Signed out successfully');
  };

  const openMovieDetails = (movie) => {
    setSelectedMovie(movie);
    setActiveTab('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // API Call: Play Movie / Mark Watched
  const playMovie = async (movie) => {
    setSelectedMovie(movie);
    try {
      const res = await fetch(`${API_BASE}/movies/${movie.id}/watch`, {
        method: 'POST'
      });
      if (res.ok) {
        const updated = await res.json();
        setMovies(prev => prev.map(m => m.id === updated.id ? updated : m));
      }
    } catch (err) {
      console.error('Error marking movie watched:', err);
    }
    setActiveTab('watch');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      user,
      loginUser,
      logoutUser,
      movies,
      favourites,
      loadingMovies,
      toggleFavourite,
      addMovie,
      editMovie,
      deleteMovie,
      activeTab,
      setActiveTab,
      selectedMovie,
      setSelectedMovie,
      openMovieDetails,
      playMovie,
      searchQuery,
      setSearchQuery,
      toastMessage,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
