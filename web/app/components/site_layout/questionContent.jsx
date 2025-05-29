import {useState} from 'react';
import ContextBox from "../question_elements/contextBox.jsx";
import MultipleChoiceQuestion from "../question_elements/multipleChoiceQuestion.jsx";

export default function QuestionContent({content}) {

  const [hasAnswered, setHasAnswered] = useState(false);

  if (!content) {
    return (
      <p> Loading... </p>
    )
  }

  const {title, options, context, hasAnswer, answer, correctAnswerFeedback, wrongAnswerFeedback, generalAnswer} = content;

  function handleOptionClick(index) {
    if(hasAnswer) {
      (index===answer) ? console.log(correctAnswerFeedback) : console.log(wrongAnswerFeedback);
    } else {
      console.log("here is general feedback");
    }
  }

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
