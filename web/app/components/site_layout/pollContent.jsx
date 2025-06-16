import { useState, useEffect, useRef } from 'react';
import ContextBox from "../common/contextBox.jsx";
import ChoicesButtons from "../question_elements/choicesButtons.jsx";
import ViewResultsButton from "../question_elements/viewResultsButton.jsx";
import PollResults from "../question_elements/pollResults.jsx";
import ApiService from '../../services/api.js';

export default function PollContent({ content, interactCallback }) {
  const segmentId = content.id;
  const { context, title, options, id } = content;
  const [showResults, setShowResults] = useState(false);
  const [responseCounts, setResponseCounts] = useState(content.responseCounts || Array(options.length).fill(0));
  const [totalResponses, setTotalResponses] = useState(content.totalResponses || 0);
  
  // Ref to store the polling interval
  const pollingIntervalRef = useRef(null);

  // Helper function to compare poll data
  const pollDataIsEqual = (current, incoming) => {
    // Compare total responses
    if (current.totalResponses !== incoming.totalResponses) return false;
    
    // Compare response counts arrays
    if (current.responseCounts.length !== incoming.responseCounts.length) return false;
    
    return current.responseCounts.every((count, index) => 
      count === incoming.responseCounts[index]
    );
  };

  // Function to fetch segment data and update poll counts if different
  const pollSegmentData = async () => {
    try {
      const segmentData = await ApiService.getSegment(segmentId);
      
      // If this is a poll segment, check for updates
      if (segmentData.segment && segmentData.segment.type === 'poll') {
        const newPollData = segmentData.segment;
        const currentPollData = {
          responseCounts,
          totalResponses
        };
        const incomingPollData = {
          responseCounts: newPollData.responseCounts || Array(options.length).fill(0),
          totalResponses: newPollData.totalResponses || 0
        };
        
        // Only update state if poll data has actually changed
        if (!pollDataIsEqual(currentPollData, incomingPollData)) {
          setResponseCounts(incomingPollData.responseCounts);
          setTotalResponses(incomingPollData.totalResponses);
        }
      }
    } catch (error) {
      console.error('Error polling poll data:', error);
      // Don't show error to user for polling failures
    }
  };

  // Start polling when component mounts and stop when it unmounts
  useEffect(() => {
    // Start polling every 250ms
    pollingIntervalRef.current = setInterval(pollSegmentData, 250);

    // Cleanup function to clear interval
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [segmentId, id, responseCounts, totalResponses]); // Restart polling if dependencies change

  function resultsClickHandler() {
    setShowResults(true);
  }

  async function onSelectOption(index) {
    interactCallback(segmentId);

    try {
      await ApiService.submitVote(id, index);

      // Update local counts on successful vote (optimistic update)
      const newResponseCounts = [...responseCounts];
      newResponseCounts[index]++;
      setResponseCounts(newResponseCounts);
      setTotalResponses(prev => prev + 1);
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
          <PollResults 
            options={content.options} 
            responseCounts={responseCounts} 
            totalResponses={totalResponses}
          />
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
