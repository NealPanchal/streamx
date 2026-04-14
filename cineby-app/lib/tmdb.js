import axios from 'axios';

// TMDB API configuration
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

if (!TMDB_API_KEY) {
  console.warn('NEXT_PUBLIC_TMDB_API_KEY environment variable is not set');
}

// Create axios instance with default configuration
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add API key
tmdbApi.interceptors.request.use(
  (config) => {
    if (TMDB_API_KEY) {
      config.params = {
        ...config.params,
        api_key: TMDB_API_KEY,
        language: 'en-US',
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
tmdbApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common TMDB API errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          console.error('TMDB API: Invalid API key');
          break;
        case 404:
          console.error('TMDB API: Resource not found');
          break;
        case 429:
          console.error('TMDB API: Rate limit exceeded');
          break;
        default:
          console.error('TMDB API Error:', data.status_message || error.message);
      }
    } else if (error.request) {
      console.error('TMDB API: Network error', error.message);
    } else {
      console.error('TMDB API: Request setup error', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Get trending movies and TV shows
 * @param {string} mediaType - 'all', 'movie', 'tv', or 'person'
 * @param {string} timeWindow - 'day' or 'week'
 * @returns {Promise<Object>} Trending content data
 */
export const getTrending = async (mediaType = 'all', timeWindow = 'week') => {
  try {
    const response = await tmdbApi.get(`/trending/${mediaType}/${timeWindow}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trending content:', error);
    throw error;
  }
};

/**
 * Search for movies and TV shows
 * @param {string} query - Search query string
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Search results data
 */
export const searchMovies = async (query, page = 1) => {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    throw new Error('Search query must be a non-empty string');
  }

  try {
    const response = await tmdbApi.get('/search/multi', {
      params: {
        query: query.trim(),
        page,
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

/**
 * Get detailed movie information
 * @param {number|string} id - Movie ID
 * @param {Object} options - Additional options
 * @param {boolean} options.append_to_response - Additional data to append
 * @returns {Promise<Object>} Movie details data
 */
export const getMovieDetails = async (id, options = {}) => {
  if (!id) {
    throw new Error('Movie ID is required');
  }

  try {
    const response = await tmdbApi.get(`/movie/${id}`, {
      params: {
        append_to_response: options.append_to_response || 'videos,credits,similar',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

/**
 * Get detailed TV show information
 * @param {number|string} id - TV show ID
 * @param {Object} options - Additional options
 * @param {boolean} options.append_to_response - Additional data to append
 * @returns {Promise<Object>} TV show details data
 */
export const getTVDetails = async (id, options = {}) => {
  if (!id) {
    throw new Error('TV show ID is required');
  }

  try {
    const response = await tmdbApi.get(`/tv/${id}`, {
      params: {
        append_to_response: options.append_to_response || 'videos,credits,similar',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    throw error;
  }
};

/**
 * Get popular movies
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Popular movies data
 */
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

/**
 * Get popular TV shows
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Popular TV shows data
 */
export const getPopularTVShows = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/tv/popular', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    throw error;
  }
};

/**
 * Get movie genres
 * @returns {Promise<Object>} Movie genres data
 */
export const getMovieGenres = async () => {
  try {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching movie genres:', error);
    throw error;
  }
};

/**
 * Get TV show genres
 * @returns {Promise<Object>} TV show genres data
 */
export const getTVGenres = async () => {
  try {
    const response = await tmdbApi.get('/genre/tv/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching TV show genres:', error);
    throw error;
  }
};

// Export the axios instance for custom requests if needed
export default tmdbApi;
