'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useTrending, usePopularMovies, usePopularTV, useTopRatedMovies } from '@/lib/tmdb';
import dynamic from 'next/dynamic';
import { getContinueWatching } from '@/utils/storage';
import { Movie, TVShow } from '@/types';

// Dynamic imports for performance
const ContentRow = dynamic(() => import('@/components/ContentRow'), { 
  loading: () => <div className="animate-pulse bg-gray-800 h-32 w-full rounded-lg" />
});
const HeroCarousel = dynamic(() => import('@/components/HeroCarousel'), {
  loading: () => <div className="h-[85vh] bg-base-gray animate-pulse w-full" />
});
const SkeletonLoader = dynamic(() => import('@/components/SkeletonLoader'), { 
  ssr: false 
});

export default function HomePage() {
  const [continueWatching, setContinueWatching] = useState<(Movie | TVShow)[]>([]);
  const [showPlayer, setShowPlayer] = useState(false);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [playerMovie, setPlayerMovie] = useState<Movie | null>(null);
  
  // Fetch data using SWR hooks
  const { data: trendingDayData, isLoading: trendingDayLoading } = useTrending('movie', 'day');
  const { data: trendingData, isLoading: trendingLoading } = useTrending('all', 'week');
  const { data: popularMoviesData, isLoading: popularMoviesLoading } = usePopularMovies();
  const { data: popularTVData, isLoading: popularTVLoading } = usePopularTV();
  const { data: topRatedMoviesData, isLoading: topRatedLoading } = useTopRatedMovies();

  useEffect(() => {
    // Load continue watching from localStorage
    const watchedItems = getContinueWatching(10);
    setContinueWatching(watchedItems);
  }, []);

  const handlePlayContent = (movie: Movie) => {
    setPlayerMovie(movie);
    setPlayerLoading(true);
    setShowPlayer(true);
  };

  const carouselItems = trendingDayData?.results?.slice(0, 7) || [];
  const trendingMovies = trendingData?.results?.filter((item: any) => item.media_type === 'movie') || [];
  const trendingTV = trendingData?.results?.filter((item: any) => item.media_type === 'tv') || [];

  return (
    <div className="min-h-screen bg-base-black text-white font-base">
      {/* Player Overlay */}
      <AnimatePresence>
        {showPlayer && playerMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-3 bg-black/80 backdrop-blur-sm flex-shrink-0">
              <button
                onClick={() => setShowPlayer(false)}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">{playerMovie.title}</span>
              </button>
            </div>
            <div className="flex-1 relative">
              {playerLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-14 h-14 border-4 border-base-blue border-t-transparent rounded-full"
                  />
                </div>
              )}
              <iframe
                src={`https://www.vidking.net/embed/movie/${playerMovie.id}?autoPlay=true&color=0052FF`}
                className="w-full h-full border-0"
                allowFullScreen
                allow="autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                onLoad={() => setPlayerLoading(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Carousel */}
      {!trendingDayLoading && carouselItems.length > 0 ? (
        <HeroCarousel items={carouselItems} onPlay={handlePlayContent} />
      ) : (
        <section className="relative h-[85vh] mb-10">
          <SkeletonLoader type="hero" count={1} />
        </section>
      )}

      {/* Content Rows */}
      <div className="container mx-auto px-6 pb-20 space-y-12">
        <AnimatePresence>
          {continueWatching.length > 0 && (
            <ContentRow title="Continue Watching" items={continueWatching} />
          )}
          
          <ContentRow title="Trending Movies" items={trendingMovies} loading={trendingLoading} />
          <ContentRow title="New on Base Stream" items={trendingTV} loading={trendingLoading} />
          <ContentRow title="Popular Hits" items={popularMoviesData?.results || []} loading={popularMoviesLoading} />
          <ContentRow title="Binge Worthy TV" items={popularTVData?.results || []} loading={popularTVLoading} />
          <ContentRow title="Critically Acclaimed" items={topRatedMoviesData?.results || []} loading={topRatedLoading} />
        </AnimatePresence>
      </div>
    </div>
  );
}
