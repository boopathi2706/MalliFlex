import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MalliLogo } from './MalliLogo';
import { 
  Search, Sun, Moon, User, LogOut, Menu, X, 
  Heart, Eye, Film, Sparkles, Plus, LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { 
    theme, toggleTheme, user, logoutUser, 
    activeTab, setActiveTab, searchQuery, setSearchQuery 
  } = useApp();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = user?.role === 'admin' ? [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-add', label: 'Add Movie', icon: Plus },
    { id: 'home', label: 'Client Preview', icon: Eye },
  ] : [
    { id: 'home', label: 'Home' },
    { id: 'movies', label: 'Movies' },
    { id: 'tamil', label: 'Tamil' },
    { id: 'dubbed', label: 'Dubbed' },
    { id: 'favourites', label: 'Favourites' },
    { id: 'watched', label: 'Watched' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#08130D]/90 dark:bg-[#08130D]/90 light:bg-[#FFFDF7]/90 backdrop-blur-md border-b border-[#173B2B]/40 light:border-[#E6E0D2] shadow-lg py-3' 
        : 'bg-gradient-to-b from-[#08130D]/90 via-[#08130D]/40 to-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <div onClick={() => handleNavClick(user?.role === 'admin' ? 'admin-dashboard' : 'home')}>
          <MalliLogo />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === item.id
                  ? 'text-[#FFFDF7] light:text-[#173B2B] bg-[#173B2B]/60 light:bg-[#F8F4E8] border border-[#C9A227]/40 shadow-sm'
                  : 'text-[#A9B8AE] hover:text-[#FFFDF7] light:hover:text-[#173B2B] hover:bg-[#10251A]/40 light:hover:bg-[#F8F4E8]/60'
              }`}
            >
              {item.icon && <item.icon className="w-4 h-4 text-[#C9A227]" />}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Search Bar - Desktop Expandable / Mobile Direct */}
          {user?.role !== 'admin' && (
            <div className="relative">
              <div className={`flex items-center rounded-full transition-all duration-300 ${
                isSearchOpen || activeTab === 'search' || searchQuery 
                  ? 'w-44 sm:w-64 bg-[#10251A] light:bg-[#F8F4E8] border border-[#C9A227]/50 px-3 py-1.5' 
                  : 'w-10 h-10 justify-center hover:bg-[#10251A] light:hover:bg-[#F8F4E8]'
              }`}>
                <Search 
                  className="w-4 h-4 text-[#C9A227] cursor-pointer shrink-0" 
                  onClick={() => {
                    setIsSearchOpen(!isSearchOpen);
                    setActiveTab('search');
                  }}
                />
                {(isSearchOpen || activeTab === 'search' || searchQuery) && (
                  <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (activeTab !== 'search') setActiveTab('search');
                    }}
                    className="ml-2 w-full bg-transparent text-sm text-[#FFFDF7] light:text-[#173B2B] focus:outline-none placeholder-[#A9B8AE]"
                    autoFocus
                  />
                )}
              </div>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full text-[#A9B8AE] hover:text-[#FFFDF7] light:hover:text-[#173B2B] hover:bg-[#10251A] light:hover:bg-[#F8F4E8] transition-colors border border-transparent hover:border-[#C9A227]/30"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#C9A227]" />
            ) : (
              <Moon className="w-4 h-4 text-[#173B2B]" />
            )}
          </button>

          {/* User Profile Badge & Logout */}
          {user ? (
            <div className="hidden sm:flex items-center space-x-2 border-l border-[#173B2B] light:border-[#E6E0D2] pl-3">
              <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-[#10251A] light:bg-[#F8F4E8] border border-[#2F5D3A]/40">
                <User className="w-3.5 h-3.5 text-[#C9A227]" />
                <span className="text-xs font-semibold text-[#FFFDF7] light:text-[#173B2B]">
                  {user.username}
                </span>
                {user.role === 'admin' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C9A227]/20 text-[#C9A227] font-mono uppercase">
                    Admin
                  </span>
                )}
              </div>

              <button
                onClick={logoutUser}
                title="Sign Out"
                className="p-2 rounded-full text-[#A9B8AE] hover:text-red-400 hover:bg-[#10251A] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#C9A227] hover:bg-[#E2C766] text-[#08130D] transition-colors shadow-md"
            >
              Sign In
            </button>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#FFFDF7] light:text-[#173B2B] hover:bg-[#10251A] light:hover:bg-[#F8F4E8]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#C9A227]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#08130D]/95 light:bg-[#FFFDF7]/95 backdrop-blur-xl border-b border-[#173B2B] px-4 pt-3 pb-6 shadow-2xl"
          >
            <div className="flex flex-col space-y-2 mt-2">
              {user && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#10251A] light:bg-[#F8F4E8] border border-[#173B2B] mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#C9A227]" />
                    <span className="text-sm font-semibold text-[#FFFDF7] light:text-[#173B2B]">{user.username}</span>
                  </div>
                  <span className="text-xs text-[#C9A227] font-mono">{user.role}</span>
                </div>
              )}

              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
                    activeTab === item.id
                      ? 'bg-[#173B2B] text-[#FFFDF7] light:bg-[#F8F4E8] light:text-[#173B2B] border border-[#C9A227]/40'
                      : 'text-[#A9B8AE] hover:text-[#FFFDF7] hover:bg-[#10251A]/50'
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4 text-[#C9A227]" />}
                  {item.label}
                </button>
              ))}

              <div className="pt-2 border-t border-[#173B2B] light:border-[#E6E0D2] flex justify-between items-center">
                <span className="text-xs text-[#A9B8AE]">Switch Theme</span>
                <button
                  onClick={toggleTheme}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#10251A] light:bg-[#F8F4E8] text-[#C9A227] border border-[#C9A227]/30 flex items-center gap-2"
                >
                  {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </button>
              </div>

              {user && (
                <button
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full mt-2 py-2.5 rounded-xl text-sm font-medium text-red-400 bg-red-950/20 border border-red-900/30 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
