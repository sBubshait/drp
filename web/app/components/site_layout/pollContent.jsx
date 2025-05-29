import ContextBox from "../question_elements/contextBox.jsx";
import ChoicesButtons from "../question_elements/choicesButtons.jsx";
import ViewResultsButton from "../question_elements/viewResultsButton.jsx";
import PollResults from "../question_elements/pollResults.jsx";

import {useState} from 'react';

export default function PollContent({content}) {

  const {context, title, options} = content;
  const [showResults, setShowResults] = useState(false);

  function resultsClickHandler() {
    console.log("You view the results");
    setShowResults(true);
  }

  function onSelectOption(index) {
    console.log(index);
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
