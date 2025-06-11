import ContextBox from "../question_elements/contextBox.jsx";
import ChoicesButtons from "../question_elements/choicesButtons.jsx";
import ViewResultsButton from "../question_elements/viewResultsButton.jsx";
import PollResults from "../question_elements/pollResults.jsx";
import { useState } from 'react';
import ApiService from '../../services/api.js';

export default function PollContent({ content }) {
  const { context, title, options, id } = content;
  const [showResults, setShowResults] = useState(false);

  function resultsClickHandler() {
    setShowResults(true);
  }

  async function onSelectOption(index) {
    try {
      await ApiService.submitVote(id, index);

      // Update local counts on successful vote
      content.responseCounts[index]++;
      content.totalResponses++;
    } catch (error) {
      console.error('Error submitting vote:', error);
      // Still show results even if vote submission failed
    }

    setShowResults(true);
  }

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="p-3 max-h-32 overflow-y-auto">
        <ContextBox text={context} />
      </div>

      <div className="flex flex-col justify-center">
        <div className="text-2xl font-medium text-gray-800 text-center p-3">
          {title}
        </div>
      </div>

      {showResults &&
        <div className="p-3 flex flex-col space-y-4 mb-5">
          <PollResults content={content} />
        </div>
      }
      {!showResults && (
        <div className="p-3 flex flex-col space-y-4">
          <ChoicesButtons options={options} onSelectOption={onSelectOption} />
          <div className="flex justify-center">
            <ViewResultsButton resultsClickHandler={resultsClickHandler} />
          </div>
        </div>
      )}
    </div>
  );
}
