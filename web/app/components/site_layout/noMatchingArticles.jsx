import React from 'react';

export default function NoMatchingArticles({ 
  selectedFilters, 
  selectedSort,
  onResetFilters
}) {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-8">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
        </svg>
        <h2 className="text-xl font-bold text-gray-700 mb-2">No More Articles</h2>
        
        {selectedFilters.length > 0 ? (
          <p className="text-gray-600 mb-4">
            You've reached the end of articles sorted by "{selectedSort}" 
            and matching tags: <span className="font-medium">{selectedFilters.join(', ')}</span>.
          </p>
        ) : (
          <p className="text-gray-600 mb-4">
            You've reached the end of articles sorted by "{selectedSort}".
          </p>
        )}
        
        {selectedFilters.length > 0 && (
          <p className="text-sm text-gray-500 mb-3">
            Note: Articles must match ALL selected filters to be shown.
          </p>
        )}
        
        <button
          onClick={onResetFilters}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          Reset Filters & Sort
        </button>
      </div>
    </div>
  );
}