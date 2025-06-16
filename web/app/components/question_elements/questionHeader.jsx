// QuestionHeader.jsx
import { useState, useEffect } from 'react';
import XpDisplay from '../common/XpDisplay.jsx';

export default function QuestionHeader({
  questionNumber,
  totalQuestions,
  taskType,
  articleId,
  segmentId,
  hasSourcesData,
  onSourcesClick,
  isArticleSummary
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return (
    <div className="flex w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg">
      {/* Question number - left side */}
      <div className="px-6 py-3 flex items-center border-r-2 border-gray-600">
        <span className="text-white font-bold text-xl tracking-tight">
          {isArticleSummary
            ? questionNumber
            : isMobile
              ? questionNumber
              : `${questionNumber} / ${totalQuestions}`
          }
        </span>
      </div>

      {/* Task type - middle, takes remaining space */}
      <div className="px-6 py-3 flex-1 flex items-center">
        <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent text-xl font-bold tracking-tight">
          {taskType}
        </span>
      </div>

      {/* Sources and XP - right side */}
      <div className="px-6 py-3 flex items-center gap-4">
        {hasSourcesData && (
          <button
            onClick={onSourcesClick}
            className="bg-gradient-to-r from-gray-700 to-gray-600 text-white py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            title="View Sources"
          >
            <span className="text-lg">🔗</span>
          </button>
        )}
        <XpDisplay articleId={articleId} segmentId={segmentId} />
      </div>
    </div>
  );
}