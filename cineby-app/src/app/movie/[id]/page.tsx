'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import { movieApi } from '@/lib/api';
import { MovieDetails } from '@/utils/types';
import Image from 'next/image';

export default function MovieDetailPage() {
  const params = useParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await movieApi.getMovieDetails(params.id as string);
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
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
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-800 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-800 rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-gray-800 rounded mb-2"></div>
            <div className="h-4 bg-gray-800 rounded mb-2 w-5/6"></div>
            <div className="h-4 bg-gray-800 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-white text-center">Movie not found</p>
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
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {backdropUrl && (
        <div className="relative h-96 md:h-[500px]">
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 lg:w-1/4">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-yellow-400 font-semibold">
                {'\u2b50'} {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-400">
                {new Date(movie.release_date).getFullYear()}
              </span>
              <span className="text-gray-400">
                {movie.runtime} min
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre) => (
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

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed">
                {movie.overview}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Budget:</span>
                <span className="text-white ml-2">
                  ${movie.budget.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Revenue:</span>
                <span className="text-white ml-2">
                  ${movie.revenue.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <span className="text-white ml-2 capitalize">
                  {movie.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
