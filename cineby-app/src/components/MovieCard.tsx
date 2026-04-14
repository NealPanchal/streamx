import Image from 'next/image';
import Link from 'next/link';

interface MovieCardProps {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date?: string;
  media_type?: 'movie' | 'tv';
}

const MovieCard = ({ id, title, poster_path, vote_average, release_date, media_type = 'movie' }: MovieCardProps) => {
  const imageUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : '/placeholder-movie.jpg';

  const href = media_type === 'movie' ? `/movie/${id}` : `/tv/${id}`;

  return (
    <Link href={href} className="group">
      <div className="relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="aspect-[2/3] relative">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-yellow-400 text-sm font-semibold">{'\u2b50'}</span>
          <span className="text-white text-sm ml-1">{vote_average.toFixed(1)}</span>
        </div>

        {media_type && (
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
            <span className="text-white text-xs font-semibold capitalize">{media_type}</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
          <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          {release_date && (
            <p className="text-gray-300 text-xs mt-1">
              {new Date(release_date).getFullYear()}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
