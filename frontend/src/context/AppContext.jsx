import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
  const [movieError, setMovieError] = useState(null);

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState(null);

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
      setMovieError(null);
      const res = await fetch(`${API_BASE}/api/movies`);
      if (res.ok) {
        const data = await res.json();
        setMovies(Array.isArray(data) ? data : (data.movies || []));
      } else {
        setMovieError('Unable to load movies. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching movies from backend:', err);
      setMovieError('Unable to load movies. Please try again.');
    } finally {
      setLoadingMovies(false);
    }
  };

  // Fetch Favourites from Backend
  const fetchFavourites = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/favourites`);
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
      const res = await fetch(`${API_BASE}/api/favourites/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId })
      });
      if (res.ok) {
        const data = await res.json();
        setFavourites(data.favourites);
        showToast(data.isFav ? 'Added to favourites' : 'Removed from favourites');
      } else {
        setFavourites(prev => 
          prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]
        );
      }
    } catch (err) {
      console.error('Error toggling favourite:', err);
      setFavourites(prev => 
        prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]
      );
    }
  };

  // API Call: Add Movie
  const addMovie = async (newMovie) => {
    try {
      const res = await fetch(`${API_BASE}/api/movies`, {
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
      const res = await fetch(`${API_BASE}/api/movies/${updatedMovie.id}`, {
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
      const res = await fetch(`${API_BASE}/api/movies/${movieId}`, {
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
      const res = await fetch(`${API_BASE}/api/auth/login`, {
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
    setDetailError(null);
    setActiveTab('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch Movie Details Watch URL from Python API
  const fetchWatchUrl = async (movieUrl) => {
    if (!movieUrl) {
      throw new Error('Invalid movie URL');
    }
    const res = await fetch(`${API_BASE}/api/movie/details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieUrl })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || errData.error || 'Unable to retrieve movie watch URL');
    }
    const data = await res.json();
    if (!data.watchUrl) {
      throw new Error('Watch URL missing in response');
    }
    return data.watchUrl;
  };

  // API Call: Play Movie / Scrape watch URL
  const playMovie = async (movie) => {
    if (loadingDetail) return; // Prevent concurrent requests
    
    setSelectedMovie(movie);
    setDetailError(null);
    setLoadingDetail(true);

    try {
      let watchUrl = movie.videoUrl;

      // If movie has a movieUrl but no direct videoUrl yet, scrape it from python backend
      if (movie.movieUrl && (!watchUrl || watchUrl.includes('example.com') || watchUrl.includes('sample'))) {
        watchUrl = await fetchWatchUrl(movie.movieUrl);
      }

      if (!watchUrl) {
        throw new Error('Unable to load this movie. Please try again.');
      }

      setSelectedMovie(prev => ({ ...prev, videoUrl: watchUrl, watched: true }));
      setActiveTab('watch');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      fetch(`${API_BASE}/api/movies/${movie.id}/watch`, { method: 'POST' }).catch(() => {});

    } catch (err) {
      console.error('Error in playMovie:', err);
      setDetailError(err.message || 'Unable to load this movie. Please try again.');
      showToast(err.message || 'Unable to load this movie. Please try again.');
    } finally {
      setLoadingDetail(false);
    }
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
      movieError,
      loadingDetail,
      detailError,
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
