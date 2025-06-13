import React from 'react';
import XpDisplay from '../common/XpDisplay.jsx';

export default function AppHeader({ articleId, title = "PoliticoApp" }) {
  return (
    <div className="flex">
      <div className="bg-gray-800 px-6 py-3 text-white font-bold text-lg flex-1">
        {title}
      </div>
      <div className="bg-gray-800 px-6 py-3 flex items-center">
        <XpDisplay articleId={articleId} />
      </div>
    </div>
  );
}