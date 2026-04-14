'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import MovieCard from '@/components/MovieCard';
import SkeletonLoader from '@/components/SkeletonLoader';
import { searchMovies } from '@/lib/tmdb';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  // Load search history from localStorage
  useEffect(() => {
    try {
      const history = localStorage.getItem('cineby_search_history');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    useMemo(() => {
      let timeoutId;
      return (searchQuery) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        timeoutId = setTimeout(async () => {
          if (!searchQuery.trim()) {
            setSearchResults([]);
            setLoading(false);
            return;
          }

          setLoading(true);
          setError(null);

          try {
            const response = await searchMovies(searchQuery.trim());
            setSearchResults(response.results || []);

            // Add to search history
            if (searchQuery.trim()) {
              const newHistory = [searchQuery.trim(), ...searchHistory.filter(h => h !== searchQuery.trim())].slice(0, 10);
              setSearchHistory(newHistory);
              localStorage.setItem('cineby_search_history', JSON.stringify(newHistory));
            }
          } catch (error) {
            console.error('Error searching content:', error);
            setError('Failed to search. Please try again.');
          } finally {
            setLoading(false);
          }
        }, 500); // 500ms debounce delay
      };
    }, [searchHistory])
  , [searchHistory]);

  // Perform search when query changes
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  // Handle search input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  // Handle search history click
  const handleHistoryClick = (historyQuery) => {
    setQuery(historyQuery);
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('cineby_search_history');
  };

  // Group results by media type
  const groupedResults = useMemo(() => {
    const movies = searchResults.filter(item => item.media_type === 'movie');
    const tvShows = searchResults.filter(item => item.media_type === 'tv');
    const people = searchResults.filter(item => item.media_type === 'person');

    return { movies, tvShows, people };
  }, [searchResults]);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-6">Search</h1>
          
          <div className="relative max-w-2xl">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search for movies, TV shows, and people..."
              className="w-full bg-gray-800 text-white px-6 py-4 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-red-500 pr-12"
              autoFocus
            />
            
            {loading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              </div>
            )}
          </div>
        </div>

        {/* Search History */}
        {!query && searchHistory.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Recent Searches</h2>
              <button
                onClick={clearHistory}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Clear All
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((historyQuery, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(historyQuery)}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 hover:text-white transition-colors"
                >
                  {historyQuery}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => debouncedSearch(query)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && query && (
          <div className="space-y-8">
            <SkeletonLoader type="row" count={1} />
          </div>
        )}

        {/* Search Results */}
        {!loading && query && !error && (
          <div>
            {searchResults.length > 0 ? (
              <div>
                <p className="text-gray-400 mb-6">
                  {searchResults.length} results for "{query}"
                </p>

                {/* Movies */}
                {groupedResults.movies.length > 0 && (
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">
                      Movies ({groupedResults.movies.length})
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {groupedResults.movies.map((item) => (
                        <MovieCard
                          key={`movie-${item.id}`}
                          id={item.id}
                          title={item.title}
                          poster_path={item.poster_path}
                          backdrop_path={item.backdrop_path}
                          vote_average={item.vote_average}
                          release_date={item.release_date}
                          media_type="movie"
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* TV Shows */}
                {groupedResults.tvShows.length > 0 && (
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">
                      TV Shows ({groupedResults.tvShows.length})
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {groupedResults.tvShows.map((item) => (
                        <MovieCard
                          key={`tv-${item.id}`}
                          id={item.id}
                          title={item.name}
                          poster_path={item.poster_path}
                          backdrop_path={item.backdrop_path}
                          vote_average={item.vote_average}
                          first_air_date={item.first_air_date}
                          media_type="tv"
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* People */}
                {groupedResults.people.length > 0 && (
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">
                      People ({groupedResults.people.length})
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {groupedResults.people.map((person) => (
                        <div
                          key={`person-${person.id}`}
                          className="text-center group cursor-pointer"
                        >
                          <div className="relative overflow-hidden rounded-full w-full aspect-square mb-2">
                            {person.profile_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                                alt={person.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <span className="text-gray-600 text-4xl">{'\ud83d\udc64'}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">
                            {person.name}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {person.known_for_department}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4">
                  <span className="text-6xl text-gray-600">{'\ud83d\udd0d'}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No results found
                </h3>
                <p className="text-gray-400">
                  Try searching for different keywords or check your spelling
                </p>
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!query && !loading && (
          <div className="text-center py-12">
            <div className="mb-4">
              <span className="text-6xl text-gray-600">{'\ud83c\udfac'}</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Start searching
            </h3>
            <p className="text-gray-400">
              Search for movies, TV shows, and people
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
