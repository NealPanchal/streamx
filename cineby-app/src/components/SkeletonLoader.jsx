const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderCard = () => (
    <div className="animate-pulse">
      <div className="bg-gray-800 rounded-lg aspect-[2/3] mb-2"></div>
      <div className="h-4 bg-gray-800 rounded mb-2"></div>
      <div className="h-3 bg-gray-800 rounded w-3/4"></div>
    </div>
  );

  const renderHero = () => (
    <div className="animate-pulse">
      <div className="h-96 bg-gray-800 rounded-lg mb-8"></div>
      <div className="h-8 bg-gray-800 rounded mb-4 w-3/4"></div>
      <div className="h-4 bg-gray-800 rounded mb-2"></div>
      <div className="h-4 bg-gray-800 rounded mb-2 w-5/6"></div>
      <div className="h-4 bg-gray-800 rounded w-4/6"></div>
    </div>
  );

  const renderText = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-800 rounded mb-2"></div>
      <div className="h-4 bg-gray-800 rounded mb-2 w-5/6"></div>
      <div className="h-4 bg-gray-800 rounded w-4/6"></div>
    </div>
  );

  const renderRow = () => (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-800 rounded mb-4 w-48"></div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex-shrink-0">
            <div className="bg-gray-800 rounded-lg w-48 aspect-[2/3]"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'hero':
        return renderHero();
      case 'text':
        return renderText();
      case 'row':
        return renderRow();
      case 'card':
      default:
        return renderCard();
    }
  };

  return (
    <div>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={type === 'row' ? 'mb-8' : ''}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
