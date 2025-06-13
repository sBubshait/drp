import React from 'react';
import XpDisplay from '../common/XpDisplay.jsx';

export default function AppHeader({ articleId, title = "PoliticoApp" }) {
  return (
    <div className="flex">
      <div className="bg-gray-800 px-6 py-3 text-white font-bold text-lg flex-1">
        {title}
      </div>
      <div className="flex items-center justify-between bg-gray-800 text-white px-6 py-3">
        <button
          onClick={() => navigate(`/leaderboard`, { state: { returnTo: `/articles/${articleId}` } })}
          className="bg-gray-700 text-white py-2 px-6 rounded-lg text-lg font-medium hover:bg-gray-750 active:bg-gray-900 transition-colors">
          Leaderboard
        </button>
      </div>
      <div className="bg-gray-800 px-6 py-3 flex items-center">
        <XpDisplay articleId={articleId} />
      </div>
    </div>
  );
}