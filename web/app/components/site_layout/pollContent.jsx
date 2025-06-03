import ContextBox from "../question_elements/contextBox.jsx";
import ChoicesButtons from "../question_elements/choicesButtons.jsx";
import ViewResultsButton from "../question_elements/viewResultsButton.jsx";
import PollResults from "../question_elements/pollResults.jsx";
import { useState } from 'react';

export default function PollContent({ content }) {
  const { context, title, options, id } = content;
  const [showResults, setShowResults] = useState(false);

  function resultsClickHandler() {
    setShowResults(true);
  }

  async function onSelectOption(index) {
    try {
      const response = await fetch(`https://api.saleh.host/vote?pollId=${id}&optionIndex=${index}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to submit vote:', response.status);
      } else {
        // Update local counts on successful vote
        content.responseCounts[index]++;
        content.totalResponses++;
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
    }

    setShowResults(true);
  }

  return (
    <>
      <div className="flex-1 p-6">
        <ContextBox text={context} />
      </div>
      <div className="mb-6">
        <div className="text-3xl font-medium text-gray-800 text-center mb-24">
          {title}
        </div>
      </div>
      {showResults ? (
        <PollResults
          content={content}
        />
      ) : (
        <>
          <ChoicesButtons options={options} onSelectOption={onSelectOption} />
          <div className="flex justify-center py-5">
            <ViewResultsButton resultsClickHandler={resultsClickHandler} />
          </div>
        </>
      )}
    </>
  );
}
