import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'your_api_key_here';

const api = axios.create({
  baseURL: API_BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

export const movieApi = {
  getTrending: (mediaType: 'all' | 'movie' | 'tv' | 'person' = 'all', timeWindow: 'day' | 'week' = 'week') =>
    api.get(`/trending/${mediaType}/${timeWindow}`),
  
  getMovieDetails: (id: string) => api.get(`/movie/${id}`),
  
  getTVDetails: (id: string) => api.get(`/tv/${id}`),
  
  search: (query: string, page: number = 1) =>
    api.get('/search/multi', {
      params: { query, page },
    }),
  
  getMovies: (category: 'popular' | 'top_rated' | 'upcoming' | 'now_playing', page: number = 1) =>
    api.get(`/movie/${category}`, {
      params: { page },
    }),
  
  getTVShows: (category: 'popular' | 'top_rated' | 'on_the_air' | 'airing_today', page: number = 1) =>
    api.get(`/tv/${category}`, {
      params: { page },
    }),
};

export default api;
