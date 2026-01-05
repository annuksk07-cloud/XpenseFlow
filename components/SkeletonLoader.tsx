import React from 'react';

const SkeletonCard: React.FC<{ height?: string; className?: string }> = ({ height = 'h-24', className = '' }) => (
  <div className={`relative overflow-hidden bg-gray-200 rounded-[20px] ${height} ${className}`}>
    <div className="shimmer"></div>
  </div>
);

const SkeletonListItem: React.FC = () => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-[20px] border border-gray-100 shadow-sm">
    <div className="w-12 h-12 rounded-full shimmer bg-gray-200"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 w-3/5 shimmer bg-gray-200 rounded"></div>
      <div className="h-3 w-1/4 shimmer bg-gray-200 rounded"></div>
    </div>
    <div className="h-6 w-1/5 shimmer bg-gray-200 rounded"></div>
  </div>
);

const SkeletonLoader: React.FC = () => {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F5F7FA] p-6 animate-pulse">
      <header className="pt-2 pb-4 flex items-center justify-between">
         <div className="h-8 w-36 bg-gray-200 rounded"></div>
         <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
      </header>

      <main className="mt-8">
        {/* Dashboard Skeleton */}
        <div className="p-6 rounded-[20px] bg-white border border-gray-100 shadow-sm mb-8">
          <div className="h-4 w-1/3 mx-auto bg-gray-200 rounded mb-4 shimmer"></div>
          <div className="h-12 w-3/5 mx-auto bg-gray-200 rounded mb-6 shimmer"></div>
          <div className="flex justify-between gap-4">
            <div className="flex-1 h-20 bg-gray-100 rounded-2xl shimmer"></div>
            <div className="flex-1 h-20 bg-gray-100 rounded-2xl shimmer"></div>
          </div>
        </div>

        {/* Subscription/List Title Skeleton */}
        <div className="h-6 w-1/2 bg-gray-200 rounded mb-4 shimmer"></div>
        
        {/* List Item Skeletons */}
        <div className="space-y-3">
            <SkeletonListItem />
            <SkeletonListItem />
            <SkeletonListItem />
        </div>
      </main>
    </div>
  );
};

export default SkeletonLoader;