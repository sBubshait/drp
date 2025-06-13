import React from 'react';

export default function FilterMenuToggle({ showMenus, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xl flex items-center justify-center"
      aria-label={showMenus ? 'Hide Filters & Sort' : 'Show Filters & Sort'}
    >
      {showMenus ? (
        // "Eye with slash" icon for hide
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7.5a11.72 11.72 0 012.91-4.36M6.53 6.53A9.98 9.98 0 0112 5c5 0 9.27 3.11 11 7.5a11.72 11.72 0 01-4.17 5.19M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18" />
        </svg>
      ) : (
        // "Eye" icon for show
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1.458 12C2.732 7.943 6.523 5 12 5c5.477 0 9.268 2.943 10.542 7-1.274 4.057-5.065 7-10.542 7-5.477 0-9.268-2.943-10.542-7z" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} fill="none"/>
        </svg>
      )}
    </button>
  );
}