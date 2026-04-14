'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import { movieApi } from '@/lib/api';
import { TVShowDetails } from '@/utils/types';
import Image from 'next/image';

export default function TVDetailPage() {
  const params = useParams();
  const [tvShow, setTVShow] = useState<TVShowDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTVShow = async () => {
      try {
        const response = await movieApi.getTVDetails(params.id as string);
        setTVShow(response.data);
      } catch (error) {
        console.error('Error fetching TV show details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTVShow();
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

  if (!tvShow) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-white text-center">TV show not found</p>
        </div>
      </div>
    );
  }

  const backdropUrl = tvShow.backdrop_path
    ? `https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`
    : null;

  const posterUrl = tvShow.poster_path
    ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
    : '/placeholder-movie.jpg';

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {backdropUrl && (
        <div className="relative h-96 md:h-[500px]">
          <Image
            src={backdropUrl}
            alt={tvShow.name}
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
                alt={tvShow.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {tvShow.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-yellow-400 font-semibold">
                {'\u2b50'} {tvShow.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-400">
                {new Date(tvShow.first_air_date).getFullYear()}
              </span>
              <span className="text-gray-400">
                {tvShow.number_of_seasons} Season{tvShow.number_of_seasons !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {tvShow.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {tvShow.tagline && (
              <p className="text-xl text-gray-400 italic mb-6">
                "{tvShow.tagline}"
              </p>
            )}

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed">
                {tvShow.overview}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-8">
              <div>
                <span className="text-gray-400">Status:</span>
                <span className="text-white ml-2 capitalize">
                  {tvShow.status}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Type:</span>
                <span className="text-white ml-2 capitalize">
                  {tvShow.type}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Episodes:</span>
                <span className="text-white ml-2">
                  {tvShow.number_of_episodes}
                </span>
              </div>
            </div>

            {tvShow.seasons && tvShow.seasons.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Seasons</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {tvShow.seasons.map((season) => (
                    <div key={season.id} className="bg-gray-800 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">
                        {season.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {season.episode_count} episodes
                      </p>
                      {season.air_date && (
                        <p className="text-gray-400 text-sm">
                          {new Date(season.air_date).getFullYear()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
