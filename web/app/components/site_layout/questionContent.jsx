import {useState} from 'react';
import ContextBox from "../question_elements/contextBox.jsx";
import MultipleChoiceQuestion from "../question_elements/multipleChoiceQuestion.jsx";
import FeedbackBox from "../question_elements/feedbackBox.jsx";

export default function QuestionContent({content}) {

  const [hasAnswered, setHasAnswered] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackBody, setFeedbackBody] = useState("");

  if (!content) {
    return (
      <p> Loading... </p>
    )
  }

  console.log(content);
  const {title, options, context, hasAnswer, answer, correctAnswerFeedback, wrongAnswerFeedback, generalAnswer} = content;

  function handleOptionClick(index) {
    if (hasAnswer) {
      if (index === answer) {
        setFeedbackTitle("Correct!");
        setFeedbackBody(correctAnswerFeedback);
      } else {
        setFeedbackTitle("Not quite...");
        setFeedbackBody(wrongAnswerFeedback);
      }
    } else {
      setFeedbackTitle("If you're curious...");
      setFeedbackBody(generalAnswer);
    }

    setHasAnswered(true); 
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
      {(hasAnswered && <FeedbackBox title={feedbackTitle} body={feedbackBody} />)}
    </>
  );
}
