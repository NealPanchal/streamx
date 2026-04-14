'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getWatchProgress } from '@/utils/storage';

const MovieCard = ({ 
  id, 
  title, 
  poster_path, 
  backdrop_path, 
  vote_average, 
  release_date, 
  first_air_date,
  media_type = 'movie',
  season = null,
  episode = null,
  className = ''
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Get watch progress
  const progress = getWatchProgress(id, media_type, season, episode);
  
  const imageUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : '/placeholder-movie.jpg';

  const backdropUrl = backdrop_path
    ? `https://image.tmdb.org/t/p/w780${backdrop_path}`
    : null;

  const href = media_type === 'movie' 
    ? `/movie/${id}` 
    : `/tv/${id}${season && episode ? `?season=${season}&episode=${episode}` : ''}`;

  const year = release_date 
    ? new Date(release_date).getFullYear()
    : first_air_date 
      ? new Date(first_air_date).getFullYear()
      : null;

  const progressPercentage = progress ? progress.percentage : 0;

  return (
    <Link href={href} className={`group block ${className}`}>
      <div 
        className="relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:z-10 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main poster */}
        <div className="aspect-[2/3] relative">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse" />
          )}
          
          <Image
            src={imageUrl}
            alt={title}
            fill
            className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Hover overlay with backdrop */}
          {isHovered && backdropUrl && (
            <div className="absolute inset-0">
              <Image
                src={backdropUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            </div>
          )}

          {/* Progress bar */}
          {progressPercentage > 0 && progressPercentage < 100 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
              <div
                className="h-full bg-red-600 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}

          {/* Rating badge */}
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
            <span className="text-yellow-400 text-sm font-semibold">{'\u2b50'}</span>
            <span className="text-white text-sm ml-1">{vote_average?.toFixed(1)}</span>
          </div>

          {/* Media type badge */}
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
            <span className="text-white text-xs font-semibold capitalize">
              {media_type}
            </span>
          </div>

          {/* Hover content */}
          {isHovered && (
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black via-black/90 to-transparent">
              <h3 className="text-white font-bold text-sm line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors">
                {title}
              </h3>
              
              {year && (
                <p className="text-gray-300 text-xs mb-2">{year}</p>
              )}

              {/* Episode info for TV shows */}
              {media_type === 'tv' && season && episode && (
                <p className="text-gray-400 text-xs mb-2">
                  S{season.toString().padStart(2, '0')} E{episode.toString().padStart(2, '0')}
                </p>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-xs font-semibold transition-colors flex items-center justify-center">
                  {'\u25b6'} Play
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-xs transition-colors">
                  {'u2139'}
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-xs transition-colors">
                  {'u2b50'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
