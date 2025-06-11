import { useState, useEffect } from "react";
import GapfillButton from "../question_elements/gapFillButton";
import ContextBox from "../question_elements/contextBox.jsx";
import FeedbackBox from "../question_elements/feedbackBox.jsx";
import clsx from "clsx";

export default function GapfillContent({ content }) {

  const {
    id,
    title,
    context,
    options,
    correctOptions,
    gapCount,
    feedback
  } = content;

  const [filledGaps, setFilledGaps] = useState([]);
  const [hasSubmitted, setSubmitted] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackBody, setFeedbackBody] = useState("");

  // Reset state when a new question is loaded (content id changes)
  useEffect(() => {
  setFilledGaps([]);
  setSubmitted(false);
  setFeedbackTitle("");
  setFeedbackBody("");
  }, [id]);


  if (!content) {
    return (
      <p> Loading... </p>
    )
  }

  const handleOptionClick = (word) => {
    if (hasSubmitted || filledGaps.length >= gapCount) return;
    setFilledGaps([...filledGaps, word]);
  };

  const handleUndo = () => {
    if (!hasSubmitted && filledGaps.length > 0) {
      setFilledGaps(filledGaps.slice(0, -1));
    }
  };

  const handleSubmit = (filledGaps) => {
    if (filledGaps.length === gapCount) {
      if (filledGaps.every((word, idx) => word === correctOptions[idx])) {
        setFeedbackTitle("Correct!");
        setFeedbackBody(feedback);
      } else {
        setFeedbackTitle("Not quite...");
        setFeedbackBody("reread the article/video and have another go!");
      }
      setSubmitted(true);
    }
  };

  const renderSentence = () => {
    const parts = title.split("___");
    return parts.map((part, idx) => (
      <span key={idx}>
        {part}
        {idx < gapCount && (
          <span className="inline-block min-w-[3rem] mx-1 border-b-2 text-center text-teal-400 font-bold">
            {filledGaps[idx] || ""}
          </span>
        )}
      </span>
    ));
  };

  const isUsed = (word) => filledGaps.includes(word);

  return (
    <div className="p-4 space-y-6 flex flex-col items-center">
      <div className="flex-1 p-6">
        <ContextBox text={context} />
      </div>

      <div className="text-3xl font-medium text-gray-800 text-center text-center">{renderSentence()}</div>

      <div className="flex justify-end gap-2 mt-6 w-full max-w-md">
        <GapfillButton
          label="Undo"
          onClick={handleUndo}
          disabled={filledGaps.length === 0 || hasSubmitted}
          type="secondary"
        />
        <GapfillButton
          label="Submit"
          onClick={() => handleSubmit(filledGaps)}
          disabled={filledGaps.length !== gapCount || hasSubmitted}
          type="success"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {options.map((word, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionClick(word)}
            disabled={isUsed(word) || hasSubmitted}
            className={clsx(
              isUsed(word) || hasSubmitted
                ? "bg-gray-800 text-white rounded-lg p-6 shadow-2xl h-full overflow-y-auto cursor-not-allowed"
                : "bg-cyan-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-cyan-700 active:bg-cyan-800 transition-colors"
            )}
          >
            {word}
          </button>
        ))}
      </div>
      
      {hasSubmitted && <FeedbackBox title={feedbackTitle} body={feedbackBody} />}
   
    </div>
  );
}
