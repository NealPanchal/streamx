/**
 * /watch — Protected Streaming Hub
 *
 * Accessible only to users with a valid 24-hour pass.
 * Shows access status, countdown timer, and redirects to main content.
 */

'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Clock,
  Shield,
  Film,
  Tv,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import AccessGate from '@/components/AccessGate';
import CountdownTimer from '@/components/CountdownTimer';
import AccessBadge from '@/components/AccessBadge';
import WalletConnect from '@/components/WalletConnect';
import Logo from '@/components/Logo';
import { useAccess } from '@/hooks/useAccess';
import { shortenAddress } from '@/lib/blockchain';

// ============================================================================
// Content categories for the streaming hub
// ============================================================================

const categories = [
  {
    title: 'Movies',
    description: 'Thousands of titles across every genre',
    icon: Film,
    href: '/movies',
    gradient: 'from-base-blue/20 to-blue-600/5',
  },
  {
    title: 'TV Shows',
    description: 'Binge-worthy series and originals',
    icon: Tv,
    href: '/tv',
    gradient: 'from-purple-500/20 to-purple-700/5',
  },
  {
    title: 'Trending',
    description: "What everyone's watching right now",
    icon: Sparkles,
    href: '/',
    gradient: 'from-emerald-500/20 to-emerald-700/5',
  },
];

// ============================================================================
// Page Component (wrapped in AccessGate)
// ============================================================================

function WatchContent() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-base-black text-white">
      {/* Header */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Logo size={34} color="#0052FF" />
          <span className="text-lg font-black tracking-tighter hidden sm:block">
            BASE STREAM
          </span>
        </div>

        <div className="flex items-center gap-4">
          <WalletConnect compact />
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        {/* Welcome section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            Explore{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-base-blue to-blue-400">
              Unlimited Streaming
            </span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto text-lg">
            Enjoy thousands of movies and TV shows instantly. No restrictions, just pure entertainment.
          </p>
        </motion.div>

        {/* Browse categories */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((cat, index) => (
              <motion.button
                key={cat.title}
                onClick={() => router.push(cat.href)}
                className={`group relative p-8 rounded-2xl bg-gradient-to-br ${cat.gradient} border border-white/[0.06] hover:border-white/15 transition-all duration-300 text-left overflow-hidden`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-white/[0.06] flex items-center justify-center mb-6 group-hover:bg-white/10 transition-all">
                    <cat.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-6">
                    {cat.description}
                  </p>
                  <div className="flex items-center gap-2 text-base-blue text-sm font-semibold group-hover:gap-3 transition-all">
                    <span>Explore Library</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Quick play CTA */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={() => router.push('/')}
            className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-base-blue to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-base-blue/30 hover:shadow-base-blue/50 transition-all text-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Play size={24} fill="white" />
            <span>Go to Home</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default function WatchPage() {
  return <WatchContent />;
}
