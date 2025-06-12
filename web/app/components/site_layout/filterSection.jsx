export default function FilterSection({
  selectedFilters,
  filterOptions,
  showFilterMenu,
  setShowFilterMenu,
  handleFilterToggle,
  handleClearFilters,
  getFilterDisplayText
}) {
  return (
    <div className="bg-gray-200 px-6 py-3">
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
  );
}