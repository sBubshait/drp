import React from 'react';

export default function SortBySection({
  selectedSort,
  setSelectedSort,
  showSortMenu,
  setShowSortMenu,
  onSortChange
}) {
  const sortOptions = ['Auto', 'Popular', 'Recent', 'Hot'];

  const handleSortSelect = (sortOption) => {
    // Update the selected sort
    setSelectedSort(sortOption);
    setShowSortMenu(false);
    
    // Use callback for in-memory sorting
    if (onSortChange) {
      onSortChange(sortOption);
    }
  };

  return (
    <div className="relative w-fit">
      <button
        onClick={() => setShowSortMenu(!showSortMenu)}
        className="bg-gray-700 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
      >
        <span>Sort By: {selectedSort}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {showSortMenu && (
        <div className="absolute left-0 top-full mt-1 bg-white rounded-md shadow-lg border z-50 min-w-[120px]">
          {sortOptions.map((sortOption) => (
            <button
              key={sortOption}
              onClick={() => handleSortSelect(sortOption)}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                selectedSort === sortOption ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              {sortOption}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}