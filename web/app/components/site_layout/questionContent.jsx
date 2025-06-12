import { useState } from 'react';
import ContextBox from "../question_elements/contextBox.jsx";
import FeedbackBox from "../question_elements/feedbackBox.jsx";
import ChoicesButtons from "../question_elements/choicesButtons.jsx";
export default function QuestionContent({ content, interactCallback }) {

  const [hasAnswered, setHasAnswered] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackBody, setFeedbackBody] = useState("");

  if (!content) {
    return (
      <p> Loading... </p>
    )
  }

  const segmentId = content.id;
  const { title, options, context, hasAnswer, answer, correctAnswerFeedback, wrongAnswerFeedback, generalAnswer } = content;

  function handleOptionClick(index) {
    interactCallback(segmentId);

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
    <div className="flex flex-col h-full justify-between">
      <div className="p-3 max-h-80 overflow-y-auto">
        <ContextBox text={context} />
      </div>

      <div className="flex flex-col justify-center">
        <div className="text-2xl font-medium text-gray-800 text-center p-3">
          {title}
        </div>
      </div>

      <div className="p-3">
        <ChoicesButtons options={options} onSelectOption={(index) => handleOptionClick(index)} />
      </div>

      {hasAnswered && <FeedbackBox title={feedbackTitle} body={feedbackBody} />}
    </div>
  );
}
