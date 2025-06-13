import XpDisplay from '../common/XpDisplay.jsx';

export default function QuestionHeader({ questionNumber, totalQuestions, taskType, onSourcesClick, hasSourcesData, articleId, segmentId }) {
  const isArticleSummary = taskType === "Article Summary";

  return (
    <div className="flex w-full bg-gray-800 text-white font-semibold text-3xl">
      <div className="px-4 py-3 border-r-4 border-gray-200">
        {isArticleSummary ? questionNumber : `${questionNumber} / ${totalQuestions}`}
      </div>
      <div className="px-4 py-3 flex-1">
        {taskType}
      </div>
      <div className="px-4 py-3 flex items-center gap-4">
        <XpDisplay articleId={articleId} segmentId={segmentId} />
        {hasSourcesData && (
          <button
            onClick={onSourcesClick}
            className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200 border border-gray-600 hover:border-gray-500"
            title="View Sources"
          >
            <span className="text-2xl">🔗</span>
          </button>
        )}
      </div>
    </div>
  );
}