'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Player from '@/components/Player';
import SkeletonLoader from '@/components/SkeletonLoader';
import MovieCard from '@/components/MovieCard';
import { getTVDetails, getPopularTVShows } from '@/lib/tmdb';
import { addToWatchHistory, saveUserPreferences, getUserPreferences } from '@/utils/storage';

export default function TVDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [tvShow, setTVShow] = useState(null);
  const [similarTV, setSimilarTV] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTVShow = async () => {
      try {
        setLoading(true);
        setError(null);

        const [tvResponse, similarResponse] = await Promise.all([
          getTVDetails(params.id, { append_to_response: 'videos,credits,similar' }),
          getPopularTVShows()
        ]);

        setTVShow(tvResponse);
        setSimilarTV(similarResponse.results.slice(0, 8));

        // Set initial season and episode from URL params or defaults
        const seasonParam = searchParams.get('season');
        const episodeParam = searchParams.get('episode');
        
        if (seasonParam && episodeParam) {
          setSelectedSeason(parseInt(seasonParam));
          setSelectedEpisode(parseInt(episodeParam));
        } else if (tvResponse.seasons && tvResponse.seasons.length > 0) {
          setSelectedSeason(1);
          setSelectedEpisode(1);
        }

        // Add to watch history
        addToWatchHistory({
          id: tvResponse.id,
          title: tvResponse.name,
          type: 'tv',
          poster_path: tvResponse.poster_path,
          backdrop_path: tvResponse.backdrop_path,
          season: selectedSeason,
          episode: selectedEpisode
        });
      } catch (error) {
        console.error('Error fetching TV show details:', error);
        setError('Failed to load TV show details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTVShow();
    }
  }, [params.id, selectedSeason, selectedEpisode, searchParams]);

  const handleSeasonChange = (season) => {
    setSelectedSeason(season);
    setSelectedEpisode(1);
    
    // Save last watched episode
    saveUserPreferences({
      lastWatchedSeason: season,
      lastWatchedEpisode: 1
    });
  };

  const handleEpisodeChange = (episode) => {
    setSelectedEpisode(episode);
    
    // Save last watched episode
    saveUserPreferences({
      lastWatchedSeason: selectedSeason,
      lastWatchedEpisode: episode
    });

    // Add to watch history with new episode
    if (tvShow) {
      addToWatchHistory({
        id: tvShow.id,
        title: tvShow.name,
        type: 'tv',
        poster_path: tvShow.poster_path,
        backdrop_path: tvShow.backdrop_path,
        season: selectedSeason,
        episode: episode
      });
    }
  };

  const getCurrentSeason = () => {
    if (!tvShow?.seasons) return null;
    return tvShow.seasons.find(s => s.season_number === selectedSeason);
  };

  const currentSeason = getCurrentSeason();

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

  if (error || !tvShow) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error || 'TV show not found'}</p>
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

  const backdropUrl = tvShow.backdrop_path
    ? `https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`
    : null;

  const posterUrl = tvShow.poster_path
    ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
    : '/placeholder-movie.jpg';

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Hero Banner */}
      {backdropUrl && (
        <div className="relative h-[70vh] mb-8">
          <div className="absolute inset-0">
            <img
              src={backdropUrl}
              alt={tvShow.name}
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
                    alt={tvShow.name}
                    className="w-48 md:w-64 rounded-lg shadow-2xl"
                  />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                    {tvShow.name}
                  </h1>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                    <span className="text-yellow-400 font-semibold text-lg">
                      {'\u2b50'} {tvShow.vote_average?.toFixed(1)}
                    </span>
                    <span className="text-gray-300">
                      {new Date(tvShow.first_air_date).getFullYear()}
                    </span>
                    <span className="text-gray-300">
                      {tvShow.number_of_seasons} Season{tvShow.number_of_seasons !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
                    {tvShow.genres?.map((genre) => (
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

                  <p className="text-gray-300 leading-relaxed mb-8 max-w-3xl">
                    {tvShow.overview}
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

      {/* Season and Episode Selectors */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-4">
            <label className="text-white font-semibold">Season:</label>
            <select
              value={selectedSeason}
              onChange={(e) => handleSeasonChange(parseInt(e.target.value))}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {tvShow.seasons?.map((season) => (
                <option key={season.id} value={season.season_number}>
                  {season.name}
                </option>
              ))}
            </select>
          </div>

          {currentSeason && (
            <div className="flex items-center gap-4">
              <label className="text-white font-semibold">Episode:</label>
              <select
                value={selectedEpisode}
                onChange={(e) => handleEpisodeChange(parseInt(e.target.value))}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {Array.from({ length: currentSeason.episode_count }, (_, i) => i + 1).map((episode) => (
                  <option key={episode} value={episode}>
                    Episode {episode}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Player Section */}
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          {tvShow.name} - S{selectedSeason.toString().padStart(2, '0')} E{selectedEpisode.toString().padStart(2, '0')}
        </h2>
        <Player
          id={tvShow.id}
          type="tv"
          season={selectedSeason}
          episode={selectedEpisode}
          title={`${tvShow.name} - S${selectedSeason.toString().padStart(2, '0')} E${selectedEpisode.toString().padStart(2, '0')}`}
        />
      </div>

      {/* TV Show Details */}
      <div className="container mx-auto px-4 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-8">
          <div>
            <span className="text-gray-400 block mb-1">Status:</span>
            <span className="text-white block capitalize">
              {tvShow.status || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block mb-1">Type:</span>
            <span className="text-white block capitalize">
              {tvShow.type || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block mb-1">Episodes:</span>
            <span className="text-white block">
              {tvShow.number_of_episodes || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block mb-1">Language:</span>
            <span className="text-white block">
              {tvShow.original_language?.toUpperCase() || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Similar TV Shows */}
      {similarTV.length > 0 && (
        <div className="container mx-auto px-4 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Similar TV Shows</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {similarTV.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-48">
                <MovieCard
                  id={item.id}
                  title={item.name}
                  poster_path={item.poster_path}
                  backdrop_path={item.backdrop_path}
                  vote_average={item.vote_average}
                  first_air_date={item.first_air_date}
                  media_type="tv"
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
