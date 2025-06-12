export default function NoMatchingArticles({ 
  selectedFilters, 
  filterOptions, 
  showFilterMenu, 
  setShowFilterMenu, 
  handleFilterToggle,
  handleClearFilters,
  onGoToFirstArticle 
}) {
  // Format filter display text
  const getFilterDisplayText = () => {
    if (selectedFilters.length === 0) return 'All';
    if (selectedFilters.length === 1) return selectedFilters[0];
    return `${selectedFilters.length} filters`;
  };

  const getFilterDescription = () => {
    if (selectedFilters.length === 0) return 'any filters';
    if (selectedFilters.length === 1) return `"${selectedFilters[0]}"`;
    return `all of these filters: ${selectedFilters.join(', ')}`;
  };

  return (
    <div className="w-full bg-gray-200 flex flex-col min-h-screen overflow-hidden relative">
      {/* Header - simplified without filter */}
      <div className="flex">
        <div className="bg-gray-800 px-6 py-3 text-white font-bold text-lg flex-1">
          <span>PoliticoApp</span>
        </div>
      </div>

      {/* Filter Section - below header, on the left */}
      <div className="bg-gray-200 border-b border-gray-300 px-6 py-3">
        <div className="relative w-fit">
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
          >
            <span>Filter: {getFilterDisplayText()}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showFilterMenu && (
            <div className="absolute left-0 top-full mt-1 bg-white rounded-md shadow-lg border z-50 min-w-[180px]">
              {/* Clear all filters option */}
              {selectedFilters.length > 0 && (
                <>
                  <button
                    onClick={handleClearFilters}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600 font-medium border-b"
                  >
                    Clear All Filters
                  </button>
                </>
              )}
              
              {/* Filter options with checkboxes */}
              {filterOptions.map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterToggle(filter)}
                  className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(filter)}
                    onChange={() => {}} // Handled by button click
                    className="mr-2 rounded"
                    tabIndex={-1}
                  />
                  <span>{filter}</span>
                </button>
              ))}
              
              {/* Show selected filters count */}
              {selectedFilters.length > 0 && (
                <div className="px-4 py-2 text-xs text-gray-500 border-t">
                  {selectedFilters.length} filter{selectedFilters.length !== 1 ? 's' : ''} selected
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* No Matching Articles Content */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl mb-4">📰</div>
          <h1 className="text-3xl font-bold text-gray-800">No Matching Articles</h1>
          <p className="text-gray-600 text-lg">
            We couldn't find any articles matching {getFilterDescription()}.
          </p>
          {selectedFilters.length > 1 && (
            <p className="text-gray-500 text-sm">
              Articles must match ALL selected filters to be shown.
            </p>
          )}
          <div className="space-y-2">
            <button
              onClick={handleClearFilters}
              className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
            <button
              onClick={onGoToFirstArticle}
              className="block w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go to First Article
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}