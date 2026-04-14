'use client';

import { useEffect, useRef, useState } from 'react';
import { saveWatchProgress, addToWatchHistory } from '@/utils/storage';

const Player = ({ id, type, season = null, episode = null, title }) => {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  // Build VidKing embed URL
  const buildEmbedUrl = () => {
    const baseUrl = 'https://vidking.pro';
    
    if (type === 'movie') {
      let url = `${baseUrl}/embed/movie/${id}`;
      
      // Add saved progress if exists
      const savedProgress = localStorage.getItem(`movie_${id}_progress`);
      if (savedProgress) {
        url += `?progress=${savedProgress}`;
      }
      
      // Add parameters
      const params = new URLSearchParams(savedProgress ? {} : undefined);
      params.set('color', 'e50914');
      params.set('autoPlay', 'true');
      
      return url + (savedProgress ? '&' : '?') + params.toString();
    } else if (type === 'tv' && season && episode) {
      let url = `${baseUrl}/embed/tv/${id}/${season}/${episode}`;
      
      // Add saved progress if exists
      const savedProgress = localStorage.getItem(`tv_${id}_s${season}_e${episode}_progress`);
      if (savedProgress) {
        url += `?progress=${savedProgress}`;
      }
      
      // Add parameters
      const params = new URLSearchParams(savedProgress ? {} : undefined);
      params.set('color', 'e50914');
      params.set('autoPlay', 'true');
      params.set('nextEpisode', 'true');
      params.set('episodeSelector', 'true');
      
      return url + (savedProgress ? '&' : '?') + params.toString();
    }
    
    return null;
  };

  // Handle player events
  useEffect(() => {
    const handleMessage = (event) => {
      // Verify origin for security
      if (!event.origin.includes('vidking.pro')) return;

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        if (data.type === 'PLAYER_EVENT') {
          const { event: playerEvent, data: eventData } = data;
          
          switch (playerEvent) {
            case 'ready':
              setIsLoading(false);
              setError(null);
              break;
              
            case 'timeupdate':
              if (eventData.currentTime && eventData.duration) {
                const percentage = (eventData.currentTime / eventData.duration) * 100;
                setProgress(percentage);
                
                // Save progress every 10 seconds
                if (Math.floor(eventData.currentTime) % 10 === 0) {
                  saveWatchProgress(
                    id,
                    type,
                    eventData.currentTime,
                    eventData.duration,
                    season,
                    episode
                  );
                }
              }
              break;
              
            case 'ended':
              // Mark as completed
              saveWatchProgress(id, type, 0, 0, season, episode);
              break;
              
            case 'error':
              setError(eventData.message || 'An error occurred');
              setIsLoading(false);
              break;
              
            case 'play':
              // Add to watch history when playback starts
              if (title) {
                addToWatchHistory({
                  id,
                  title,
                  type,
                  season,
                  episode,
                  poster_path: null, // Will be set by parent
                  backdrop_path: null
                });
              }
              break;
          }
        }
      } catch (error) {
        console.error('Error parsing player message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [id, type, season, episode, title]);

  // Save progress on unmount
  useEffect(() => {
    return () => {
      if (iframeRef.current) {
        // Try to get current time from iframe
        try {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ type: 'GET_CURRENT_TIME' }),
            '*'
          );
        } catch (error) {
          console.error('Error getting current time:', error);
        }
      }
    };
  }, [id, type, season, episode]);

  const embedUrl = buildEmbedUrl();

  if (!embedUrl) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-900 rounded-lg">
        <p className="text-red-500">Invalid player configuration</p>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-white">Loading player...</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {progress > 0 && progress < 100 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
          <div
            className="h-full bg-red-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Player iframe */}
      <iframe
        ref={iframeRef}
        src={embedUrl}
        className="w-full h-full min-h-[500px] border-0"
        allowFullScreen
        allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError('Failed to load player');
          setIsLoading(false);
        }}
      />
    </div>
  );
};

export default Player;
