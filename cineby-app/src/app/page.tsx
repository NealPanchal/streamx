'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import MovieGrid from '@/components/MovieGrid';
import { movieApi } from '@/lib/api';
import { Movie, TVShow } from '@/utils/types';

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingTV, setTrendingTV] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesResponse, tvResponse] = await Promise.all([
          movieApi.getTrending('movie', 'week'),
          movieApi.getTrending('tv', 'week'),
        ]);

        setTrendingMovies(moviesResponse.data.results);
        setTrendingTV(tvResponse.data.results);
      } catch (error) {
        console.error('Error fetching trending content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Trending Movies This Week</h2>
          <MovieGrid items={trendingMovies} loading={loading} />
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Trending TV Shows This Week</h2>
          <MovieGrid items={trendingTV} loading={loading} />
        </section>
      </main>
    </div>
  );
}
