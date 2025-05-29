import QuestionHeader from "../components/question_elements/questionHeader.jsx";
import ContextBox from "../components/question_elements/contextBox.jsx";
import MultipleChoiceQuestion from "../components/question_elements/multipleChoiceQuestion.jsx";

export function QuestionPage() {
  const handleOptionClick = (option) => {
    alert(`Selected option: ${option}`);
  };

  return (
    <div className="w-full bg-gray-200 flex flex-col">

      <QuestionHeader questionNumber={1} totalQuestions={5} taskType={"Question"} />

      {/* Context Section - From Top */}
      <div className="flex-1 p-6">
        <ContextBox text={'Trump wants to cut all federal grant money to that was supposed to go for scientific and engineering research at Harvard. He called Harvard as "radicalised", "lunatics", and "troublemakers" who don\'t deserve taxpayer cash. Instead, they can use the "ridiculous" endowments they have.'} />
      </div>

      {/* Options - At Bottom */}
      <MultipleChoiceQuestion
        questionText="What is the main reason Trump gives for cutting Harvard's federal grants?"
        options={["$5 Billion", "$15 Billion", "$35 Billion", "$53 Billion"]}
        onSelectOption={(index) => console.log("Selected option index:", index)}
      />
    </div>
  );
}
