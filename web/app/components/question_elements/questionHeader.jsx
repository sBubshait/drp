export default function QuestionHeader({ questionNumber, totalQuestions, taskType }) {
  const isArticleSummary = taskType === "Article Summary";
  
  return (
    <div className="flex w-[90%] bg-gray-800 text-white font-semibold text-3xl">
      <div className="px-4 py-3 border-r-4 border-gray-200">
        {isArticleSummary ? questionNumber : `${questionNumber} / ${totalQuestions}`}
      </div>
      <div className="px-4 py-3">
        {taskType}
      </div>
    </div>
  );
}
