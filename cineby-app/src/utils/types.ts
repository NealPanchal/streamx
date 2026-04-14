export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
}

export interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
  original_name: string;
}

export interface MovieDetails extends Movie {
  budget: number;
  genres: Array<{ id: number; name: string }>;
  homepage: string;
  imdb_id: string;
  production_companies: Array<{ id: number; name: string; logo_path: string }>;
  production_countries: Array<{ iso_3166_1: string; name: string }>;
  revenue: number;
  runtime: number;
  spoken_languages: Array<{ iso_639_1: string; name: string }>;
  status: string;
  tagline: string;
  videos: { results: Array<{ id: string; key: string; name: string; site: string; type: string }> };
}

export interface TVShowDetails extends TVShow {
  created_by: Array<{ id: number; name: string; profile_path: string }>;
  episode_run_time: number[];
  genres: Array<{ id: number; name: string }>;
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  networks: Array<{ id: number; name: string; logo_path: string }>;
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  production_companies: Array<{ id: number; name: string; logo_path: string }>;
  seasons: Array<{
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
  }>;
  status: string;
  tagline: string;
  type: string;
  videos: { results: Array<{ id: string; key: string; name: string; site: string; type: string }> };
}

export interface SearchResult {
  poster_path: string;
  adult: boolean;
  overview: string;
  release_date: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  original_name: string;
  title: string;
  name: string;
  backdrop_path: string;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
  media_type: 'movie' | 'tv' | 'person';
}

export interface APIResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
