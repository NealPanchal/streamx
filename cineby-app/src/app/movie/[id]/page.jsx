'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Player from '@/components/Player';
import SkeletonLoader from '@/components/SkeletonLoader';
import MovieCard from '@/components/MovieCard';
import { getMovieDetails, getPopularMovies } from '@/lib/tmdb';
import { addToWatchHistory } from '@/utils/storage';

export default function MovieDetailPage() {
  const params = useParams();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);

        const [movieResponse, similarResponse] = await Promise.all([
          getMovieDetails(params.id, { append_to_response: 'videos,credits,similar' }),
          getPopularMovies()
        ]);

        setMovie(movieResponse);
        setSimilarMovies(similarResponse.results.slice(0, 8));

        // Add to watch history
        addToWatchHistory({
          id: movieResponse.id,
          title: movieResponse.title,
          type: 'movie',
          poster_path: movieResponse.poster_path,
          backdrop_path: movieResponse.backdrop_path
        });
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError('Failed to load movie details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMovie();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <div className="relative h-[70vh] mb-8">
          <SkeletonLoader type="hero" count={1} />
        </div>
        <div className="container mx-auto px-4">
          <SkeletonLoader type="row" count={2} />
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error || 'Movie not found'}</p>
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

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-movie.jpg';

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Hero Banner */}
      {backdropUrl && (
        <div className="relative h-[70vh] mb-8">
          <div className="absolute inset-0">
            <img
              src={backdropUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>

          <div className="relative h-full flex items-center px-4">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="flex-shrink-0">
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="w-48 md:w-64 rounded-lg shadow-2xl"
                  />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                    {movie.title}
                  </h1>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                    <span className="text-yellow-400 font-semibold text-lg">
                      {'\u2b50'} {movie.vote_average?.toFixed(1)}
                    </span>
                    <span className="text-gray-300">
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                    {movie.runtime && (
                      <span className="text-gray-300">
                        {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
                    {movie.genres?.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>

                  {movie.tagline && (
                    <p className="text-xl text-gray-400 italic mb-6">
                      "{movie.tagline}"
                    </p>
                  )}

                  <p className="text-gray-300 leading-relaxed mb-8 max-w-3xl">
                    {movie.overview}
                  </p>

                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <button className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center gap-2">
                      {'\u25b6'} Play Now
                    </button>
                    <button className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold">
                      {'u2b50'} Add to List
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Player Section */}
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Watch Now</h2>
        <Player
          id={movie.id}
          type="movie"
          title={movie.title}
        />
      </div>

      {/* Movie Details */}
      <div className="container mx-auto px-4 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-8">
          <div>
            <span className="text-gray-400 block mb-1">Budget:</span>
            <span className="text-white block">
              ${movie.budget?.toLocaleString() || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block mb-1">Revenue:</span>
            <span className="text-white block">
              ${movie.revenue?.toLocaleString() || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block mb-1">Status:</span>
            <span className="text-white block capitalize">
              {movie.status || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block mb-1">Language:</span>
            <span className="text-white block">
              {movie.original_language?.toUpperCase() || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <div className="container mx-auto px-4 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Similar Movies</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {similarMovies.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-48">
                <MovieCard
                  id={item.id}
                  title={item.title}
                  poster_path={item.poster_path}
                  backdrop_path={item.backdrop_path}
                  vote_average={item.vote_average}
                  release_date={item.release_date}
                  media_type="movie"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
