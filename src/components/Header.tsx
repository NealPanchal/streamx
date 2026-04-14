'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, User, LogOut, Play, List, Home, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
import { cn } from '@/utils';
import { getUserProfile } from '@/utils/storage';
import Logo from './Logo';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { address, isConnected } = useAccount();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (isConnected && address) {
      setProfile(getUserProfile(address));
    } else {
      setProfile(null);
    }
  }, [isConnected, address]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Movies', href: '/movies' },
    { label: 'TV Shows', href: '/tv' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-500 py-4 px-6 md:px-12',
        isScrolled 
          ? 'bg-base-black border-b border-white/5 py-3 shadow-2xl' 
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
      )}
    >
      <div className="flex items-center justify-between max-w-[1920px] mx-auto">
        <div className="flex items-center gap-8 lg:gap-12">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <motion.div
              className="flex items-center justify-center transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Logo size={42} color="#0052FF" />
            </motion.div>
            <span className="ml-3 text-white font-black text-2xl tracking-tighter hidden lg:block group-hover:text-base-blue transition-colors">
              BASE STREAM
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-all duration-300 hover:text-white relative",
                    isActive ? "text-white font-bold" : "text-gray-300"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-base-blue"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-5 lg:gap-8 text-gray-300">
          {/* Expandable Search */}
          <form 
            onSubmit={handleSearch}
            className={cn(
              "flex items-center bg-black/40 border border-white/20 rounded-full transition-all duration-500 overflow-hidden px-3",
              isSearchOpen ? "w-64 md:w-80 border-white/40 ring-2 ring-base-blue/20" : "w-10 border-transparent bg-transparent"
            )}
          >
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white hover:text-base-blue transition-colors p-2 flex-shrink-0"
            >
              <Search size={20} strokeWidth={2.5} />
            </button>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Titles, people, genres..."
              className={cn(
                "bg-transparent text-white text-sm outline-none w-full transition-all duration-300 px-2",
                isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            />
            {isSearchOpen && (
               <button 
                 type="button" 
                 onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                 className="text-gray-500 hover:text-white transition-colors"
               >
                 <X size={16} />
               </button>
            )}
          </form>

          {/* Notifications */}
          <button className="hover:text-white transition-colors relative hidden sm:block">
            <Bell size={22} strokeWidth={2} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-base-blue rounded-full border-2 border-black" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 bg-zinc-800 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-all shadow-sm overflow-hidden">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={18} className="text-white" />
                )}
              </div>
              <ChevronDown size={14} className={cn("transition-transform duration-300", isUserMenuOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  key="user-menu"
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                  className="absolute right-0 mt-3 w-56 bg-zinc-900 border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-xl"
                >
                  <div className="p-2 space-y-1">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-white/5 text-gray-300 hover:text-white rounded-lg transition-all"
                    >
                      <User size={18} />
                      Profile
                    </Link>
                    <div className="h-px bg-white/5 my-2" />
                    <button className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-base-blue hover:bg-base-blue/10 w-full text-left rounded-lg transition-all">
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
