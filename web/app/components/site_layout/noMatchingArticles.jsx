import FilterSection from './filterSection.jsx';

export default function NoMatchingArticles({ 
  selectedFilters, 
  filterOptions, 
  showFilterMenu, 
  setShowFilterMenu, 
  handleFilterToggle,
  handleClearFilters,
  onGoToFirstArticle,
  getFilterDisplayText,
  selectedSort,
  setSelectedSort,
  showSortMenu,
  setShowSortMenu
}) {
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

      {/* Filter Section */}
      <FilterSection
        selectedFilters={selectedFilters}
        filterOptions={filterOptions}
        showFilterMenu={showFilterMenu}
        setShowFilterMenu={setShowFilterMenu}
        handleFilterToggle={handleFilterToggle}
        handleClearFilters={handleClearFilters}
        getFilterDisplayText={getFilterDisplayText}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        showSortMenu={showSortMenu}
        setShowSortMenu={setShowSortMenu}
      />

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