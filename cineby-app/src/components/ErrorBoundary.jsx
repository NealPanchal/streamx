'use client';

import { useState } from 'react';

const ErrorBoundary = ({ children, fallback = null }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  const handleError = (error, errorInfo) => {
    console.error('Error caught by boundary:', error, errorInfo);
    setHasError(true);
    setError(error);
  };

  const resetError = () => {
    setHasError(false);
    setError(null);
  };

  if (hasError) {
    if (fallback) {
      return fallback({ error, resetError });
    }

    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6">
            <span className="text-6xl text-red-500">{'\u26a0\ufe0f'}</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-400 mb-6">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={resetError}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-6 text-left">
              <summary className="text-gray-400 cursor-pointer hover:text-white">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 p-4 bg-gray-800 rounded text-red-400 text-xs overflow-auto">
                {error.toString()}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return (
    <div onError={handleError}>
      {children}
    </div>
  );
};

export default ErrorBoundary;
