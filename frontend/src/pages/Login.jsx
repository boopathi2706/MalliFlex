import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MalliLogo } from '../components/MalliLogo';
import { Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login = () => {
  const { loginUser } = useApp();
  const [username, setUsername] = useState('wife');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(username, password);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#08130D] overflow-hidden">
      {/* Background Poster Collage with Heavy Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80"
          alt="Cinema background"
          className="w-full h-full object-cover filter blur-md brightness-50 contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08130D] via-[#08130D]/80 to-[#08130D]/90" />
        <div className="absolute inset-0 bg-[#173B2B]/40 mix-blend-multiply" />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-[#10251A]/90 backdrop-blur-xl border border-[#2F5D3A]/60 shadow-2xl space-y-6"
      >
        <div className="flex flex-col items-center text-center space-y-3">
          <MalliLogo className="h-10" />
          
          <h2 className="font-serif-display text-2xl font-bold text-[#FFFDF7] pt-2">
            Welcome Back
          </h2>
          <p className="text-xs text-[#A9B8AE] font-light">
            Sign in to experience Arabian Jasmine styled cinema
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A9B8AE] flex items-center justify-between">
              <span>Username</span>
              <span className="text-[10px] text-[#C9A227]">e.g. wife or admin@husband</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A227]" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#08130D] border border-[#173B2B] text-sm text-[#FFFDF7] focus:outline-none focus:border-[#C9A227] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A9B8AE]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A227]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#08130D] border border-[#173B2B] text-sm text-[#FFFDF7] focus:outline-none focus:border-[#C9A227] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A9B8AE] hover:text-[#FFFDF7]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#C9A227] hover:bg-[#E2C766] text-[#08130D] font-bold text-sm shadow-xl transition-all active:scale-98 mt-2"
          >
            Sign In
          </button>
        </form>

        {/* Quick Helper Credentials */}
        <div className="pt-4 border-t border-[#173B2B] text-center space-y-1.5">
          <p className="text-[11px] text-[#A9B8AE]">Quick Demo Roles:</p>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => { setUsername('wife'); setPassword('wife'); }}
              className="px-2.5 py-1 rounded-lg text-[10px] bg-[#173B2B] text-[#FFFDF7] hover:bg-[#2F5D3A] border border-[#C9A227]/30"
            >
              Client (wife)
            </button>
            <button
              onClick={() => { setUsername('admin@husband'); setPassword('admin'); }}
              className="px-2.5 py-1 rounded-lg text-[10px] bg-[#173B2B] text-[#E2C766] hover:bg-[#2F5D3A] border border-[#C9A227]/30 font-semibold"
            >
              Admin (admin@husband)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
