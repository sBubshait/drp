import React, { useState, useRef } from 'react';

export default function UserSearchBar({ onSearch }) {
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef(null);
  
  const handleChange = (e) => {
    // Extract the value without the @ symbol
    const value = e.target.value.replace(/^@/, '');
    setSearchText(value);
    
    if (onSearch) {
      onSearch(`@${value}`);
    }
  };

  const handleFocus = () => {
    // Make sure cursor is positioned after the @ symbol
    if (inputRef.current) {
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  };

  const handleClear = () => {
    setSearchText('');
    if (onSearch) {
      onSearch('@');
    }
    // Focus back on input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-2 px-4">
      <div className="relative flex items-center">
        <div className="absolute left-0 pl-3 flex items-center pointer-events-none z-10">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          className="text-gray-500 block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search for an @UserTag"
          value={searchText ? `@${searchText}` : ''}
          onChange={handleChange}
          onFocus={handleFocus}
        />
        {searchText && (
          <button 
            onClick={handleClear}
            className="absolute right-0 pr-3 text-gray-400 hover:text-gray-500"
            type="button"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}