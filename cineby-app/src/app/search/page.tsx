'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import MovieGrid from '@/components/MovieGrid';
import { movieApi } from '@/lib/api';
import { SearchResult } from '@/utils/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchContent = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await movieApi.search(query);
        setSearchResults(response.data.results);
      } catch (error) {
        console.error('Error searching content:', error);
      } finally {
        setLoading(false);
      }
    };

    searchContent();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {query && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Search Results
            </h1>
            <p className="text-gray-400">
              {searchResults.length} results for "{query}"
            </p>
          </div>
        )}

        {!query && (
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-white mb-4">
              Search Movies & TV Shows
            </h1>
            <p className="text-gray-400">
              Use the search bar above to find your favorite content
            </p>
          </div>
        )}

        <MovieGrid items={searchResults} loading={loading} />
      </main>
    </div>
  );
}
