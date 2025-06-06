import { useState } from "react";
import GapfillButton from "../question_elements/gapFillButton";
import ContextBox from "../question_elements/contextBox.jsx";
import clsx from "clsx";

export default function GapfillContent({ content }) {
  const {
    id,
    context,
    sentenceTemplate,
    options,
    correctAnswers
  } = content;

  const [filledGaps, setFilledGaps] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleOptionClick = (word) => {
    if (submitted || filledGaps.length >= correctAnswers.length) return;
    setFilledGaps([...filledGaps, word]);
  };

  const handleUndo = () => {
    if (!submitted && filledGaps.length > 0) {
      setFilledGaps(filledGaps.slice(0, -1));
    }
  };

  const handleSubmit = () => {
    if (filledGaps.length === correctAnswers.length) {
      setSubmitted(true);
    }
  };

  const renderSentence = () => {
    const parts = sentenceTemplate.split("___");
    return parts.map((part, idx) => (
      <span key={idx}>
        {part}
        {idx < correctAnswers.length && (
          <span className="inline-block min-w-[3rem] mx-1 border-b-2 text-center text-teal-400 font-bold">
            {filledGaps[idx] || ""}
          </span>
        )}
      </span>
    ));
  };

  const isUsed = (word) => filledGaps.includes(word);

  const isCorrect =
    submitted &&
    filledGaps.length === correctAnswers.length &&
    filledGaps.every((word, idx) => word === correctAnswers[idx]);

  return (
    <div className="p-4 space-y-6 flex flex-col items-center">
      <div className="flex-1 p-6">
        <ContextBox text={context} />
      </div>

      <div className="text-3xl font-medium text-gray-800 text-center text-center">{renderSentence()}</div>

      {submitted && (
        <div className={`mt-4 text-lg font-semibold ${isCorrect ? "text-teal-600" : "text-red-600"}`}>
          {isCorrect ? "Correct!" : "Try Again!"}
        </div>
      )}

      <div className="flex justify-end gap-2 mt-6 w-full max-w-md">
        <GapfillButton
          label="Undo"
          onClick={handleUndo}
          disabled={filledGaps.length === 0 || submitted}
          type="secondary"
        />
        <GapfillButton
          label="Submit"
          onClick={handleSubmit}
          disabled={filledGaps.length !== correctAnswers.length || submitted}
          type="success"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {options.map((word, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionClick(word)}
            disabled={isUsed(word) || submitted}
            className={clsx(
              isUsed(word) || submitted
                ? "bg-gray-800 text-white rounded-lg p-6 shadow-2xl h-full overflow-y-auto cursor-not-allowed"
                : "bg-cyan-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-cyan-700 active:bg-cyan-800 transition-colors"
            )}
          >
            {word}
          </button>
        ))}
      </div>


      
    </div>
  );
}
