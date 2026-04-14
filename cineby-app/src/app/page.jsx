'use client';

import { useEffect, useState } from 'react';
import MovieCard from '@/components/MovieCard';
import SkeletonLoader from '@/components/SkeletonLoader';
import { getTrending, getPopularMovies, getPopularTVShows } from '@/lib/tmdb';
import { getContinueWatching } from '@/utils/storage';

export default function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          trendingMoviesResponse,
          trendingTVResponse,
          popularMoviesResponse,
          popularTVResponse
        ] = await Promise.all([
          getTrending('movie', 'week'),
          getTrending('tv', 'week'),
          getPopularMovies(),
          getPopularTVShows()
        ]);

        setTrendingMovies(trendingMoviesResponse.results || []);
        setTrendingTV(trendingTVResponse.results || []);
        setPopularMovies(popularMoviesResponse.results || []);
        setPopularTV(popularTVResponse.results || []);
      } catch (error) {
        console.error('Error fetching content:', error);
        setError('Failed to load content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Load continue watching from localStorage
    const watchedItems = getContinueWatching(10);
    setContinueWatching(watchedItems);
  }, []);

  const renderSection = (title, items, loadingItems = 8) => (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      
      {loading ? (
        <SkeletonLoader type="row" count={1} />
      ) : items.length > 0 ? (
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {items.map((item) => (
              <div key={`${item.id}-${item.media_type || 'movie'}`} className="flex-shrink-0 w-48">
                <MovieCard
                  id={item.id}
                  title={item.title || item.name}
                  poster_path={item.poster_path}
                  backdrop_path={item.backdrop_path}
                  vote_average={item.vote_average}
                  release_date={item.release_date}
                  first_air_date={item.first_air_date}
                  media_type={item.media_type || (item.title ? 'movie' : 'tv')}
                  season={item.season}
                  episode={item.episode}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">No content available</p>
        </div>
      )}
    </section>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Hero Section */}
      <div className="relative h-[70vh] mb-12">
        {trendingMovies.length > 0 && (
          <>
            <div className="absolute inset-0">
              <img
                src={`https://image.tmdb.org/t/p/original${trendingMovies[0].backdrop_path}`}
                alt={trendingMovies[0].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>
            
            <div className="relative h-full flex items-center justify-center text-center px-4">
              <div className="max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                  {trendingMovies[0].title}
                </h1>
                <p className="text-xl text-gray-300 mb-8 line-clamp-3">
                  {trendingMovies[0].overview}
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center gap-2">
                    {'\u25b6'} Play Now
                  </button>
                  <button className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold flex items-center gap-2">
                    {'u2139'} More Info
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="container mx-auto px-4">
        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Continue Watching</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {continueWatching.map((item) => (
                <div key={`${item.id}-${item.type}-${item.season}-${item.episode}`} className="flex-shrink-0 w-48">
                  <MovieCard
                    id={item.id}
                    title={item.title}
                    poster_path={item.poster_path}
                    backdrop_path={item.backdrop_path}
                    vote_average={item.vote_average}
                    media_type={item.type}
                    season={item.season}
                    episode={item.episode}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trending Movies */}
        {renderSection('Trending Movies', trendingMovies)}

        {/* Trending TV Shows */}
        {renderSection('Trending TV Shows', trendingTV)}

        {/* Popular Movies */}
        {renderSection('Popular Movies', popularMovies)}

        {/* Popular TV Shows */}
        {renderSection('Popular TV Shows', popularTV)}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
