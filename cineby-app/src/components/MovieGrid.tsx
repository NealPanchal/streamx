import MovieCard from './MovieCard';
import { Movie, TVShow, SearchResult } from '@/utils/types';

interface MovieGridProps {
  items: Movie[] | TVShow[] | SearchResult[];
  loading?: boolean;
}

const MovieGrid = ({ items, loading = false }: MovieGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-800 rounded-lg aspect-[2/3] mb-2"></div>
            <div className="h-4 bg-gray-800 rounded mb-2"></div>
            <div className="h-3 bg-gray-800 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No results found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item) => {
        const mediaType = 'media_type' in item ? item.media_type : 'title' in item ? 'movie' : 'tv';
        const title = 'title' in item ? item.title : item.name;
        const releaseDate = 'release_date' in item ? item.release_date : 'first_air_date' in item ? item.first_air_date : undefined;

        return (
          <MovieCard
            key={item.id}
            id={item.id}
            title={title}
            poster_path={item.poster_path}
            vote_average={item.vote_average}
            release_date={releaseDate}
            media_type={mediaType}
          />
        );
      })}
    </div>
  );
};

export default MovieGrid;
