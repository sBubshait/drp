export default function NoMatchingArticles({ 
  selectedFilter, 
  filterOptions, 
  showFilterMenu, 
  setShowFilterMenu, 
  handleFilterSelect, 
  onGoToFirstArticle 
}) {
  return (
    <div className="w-full bg-gray-200 flex flex-col min-h-screen overflow-hidden relative">
      {/* Header with Filter */}
      <div className="flex">
        <div className="bg-gray-800 px-6 py-3 text-white font-bold text-lg flex-1 flex justify-between items-center">
          <span>PoliticoApp</span>
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm flex items-center gap-2"
            >
              <span>Filter: {selectedFilter}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showFilterMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg border z-50 min-w-[120px]">
                {filterOptions.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleFilterSelect(filter)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      selectedFilter === filter ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* No Matching Articles Content */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl mb-4">📰</div>
          <h1 className="text-3xl font-bold text-gray-800">No More Matching Articles</h1>
          <p className="text-gray-600 text-lg">
            We couldn't find any articles matching the "{selectedFilter}" filter.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => handleFilterSelect('All')}
              className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Show All Articles
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