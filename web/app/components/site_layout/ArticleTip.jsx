import React from 'react';

export default function ArticleTip({ 
  showTip, 
  onClose, 
  segmentsCount, 
  isVideoArticle, 
  categories = [] 
}) {
  if (!showTip) return null;
  
  return (
    <div className="absolute bottom-4 left-4 right-4 z-40">
      <div className="bg-blue-50 bg-opacity-95 backdrop-blur-sm rounded-lg border-l-4 border-blue-400 p-4 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-blue-600 hover:text-blue-800 font-bold text-lg"
        >
          ×
        </button>
        <p className="text-blue-800 font-medium pr-6">
          💡 Tip: {segmentsCount} interactive segment{segmentsCount !== 1 ? 's' : ''} available for this article. Swipe left!
          Swipe up and down to move between articles!
          {isVideoArticle && (
            <span className="block mt-1 text-xs">
              Categories: {categories.join(', ')}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}