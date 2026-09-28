import React from 'react';
import { useApp, AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { Home } from './pages/Home';
import { Favourites } from './pages/Favourites';
import { Watched } from './pages/Watched';
import { SearchPage } from './pages/SearchPage';
import { MovieDetails } from './pages/MovieDetails';
import { VideoPlayer } from './pages/VideoPlayer';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { MovieForm } from './pages/MovieForm';

const MainLayout = () => {
  const { activeTab, user } = useApp();

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
      case 'movies':
      case 'tamil':
      case 'dubbed':
        return <Home />;
      case 'favourites':
        return <Favourites />;
      case 'watched':
        return <Watched />;
      case 'search':
        return <SearchPage />;
      case 'details':
        return <MovieDetails />;
      case 'watch':
        return <VideoPlayer />;
      case 'login':
        return <Login />;
      case 'admin-dashboard':
        return user?.role === 'admin' ? <AdminDashboard /> : <Home />;
      case 'admin-add':
        return user?.role === 'admin' ? <MovieForm mode="add" /> : <Home />;
      case 'admin-edit':
        return user?.role === 'admin' ? <MovieForm mode="edit" /> : <Home />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-[#08130D] text-[#FFFDF7] flex flex-col font-sans">
      {activeTab !== 'login' && <Navbar />}
      
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Arabian Jasmine Footer */}
      {activeTab !== 'login' && activeTab !== 'watch' && (
        <footer className="bg-[#08130D] border-t border-[#173B2B]/60 light:border-[#E6E0D2] py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#A9B8AE]">
            <div className="flex items-center gap-2">
              <span className="font-serif-display font-bold text-[#FFFDF7] text-base">MALLI FLIX</span>
              <span>— Inspired by Arabian Jasmine Elegance & Cinema</span>
            </div>
            <p>© 2026 Malli Flix. Designed for romantic, cinematic & botanical sophistication.</p>
          </div>
        </footer>
      )}

      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
