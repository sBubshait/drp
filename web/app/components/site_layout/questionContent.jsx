import ContextBox from "../question_elements/contextBox.jsx";
import MultipleChoiceQuestion from "../question_elements/multipleChoiceQuestion.jsx";

export default function QuestionContent({content}) {

  if (!content) {
    return (
      <p> Loading... </p>
    )
  }

  const {title, options, context} = content;

  return (
    <>
      <div className="flex-1 p-6">
        <ContextBox text={context} />
      </div>

      <MultipleChoiceQuestion
        questionText={title}
        options={options}
        onSelectOption={(index) => handleOptionClick(index)}
      />
    </>
  );
}
