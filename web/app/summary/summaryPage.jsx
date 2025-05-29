import QuestionHeader from "../components/question_elements/questionHeader.jsx"

export function SummaryPage() {
  const text = "In addition, multiple other penalties were levied towards Harvard. Among them was demanding that Harvard be subject to regular inspections and reports of its staff's political alignments, lest it lose its tax-exempt status.";
  
  return (
    <div className="w-full h-screen bg-gray-200 flex flex-col">
      <QuestionHeader questionNumber={1} totalQuestions={1} taskType={'Article'} /> 
      <div className="flex-1 p-8">
        <div className="text-gray-700 leading-relaxed text-2xl max-w-4xl text-center">
          {text}
        </div>
      </div>
    </div>
  );

}
