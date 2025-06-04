import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import QuestionHeader from "../components/question_elements/questionHeader.jsx";
import QuestionContent from "../components/site_layout/questionContent.jsx";
import PollContent from "../components/site_layout/pollContent.jsx";

export function QuestionPage() {
  const [fetchedQuestion, setFetchedQuestion] = useState();

  function capitalise(s) {
    return s && String(s[0]).toUpperCase() + String(s).slice(1);
  }

  // Function to fetch question by ID
  const fetchQuestion = (id) => {
    const url = id ? `https://api.saleh.host/getFeed?id=${id}` : 'https://api.saleh.host/getFeed';
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setFetchedQuestion(data);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  };

  // Navigation functions
  const goToNext = () => {
    if (fetchedQuestion?.next) {
      fetchQuestion(fetchedQuestion.next);
    }
  };

  const goToPrev = () => {
    if (fetchedQuestion?.prev) {
      fetchQuestion(fetchedQuestion.prev);
    }
  };

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: goToNext,   // Swipe left to go to next
    onSwipedRight: goToPrev,  // Swipe right to go to previous
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true // This enables mouse dragging for testing on desktop
  });

  // Initial fetch on component mount
  useEffect(() => {
    fetchQuestion(); // No ID parameter for initial load
  }, []);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!fetchedQuestion) return;

      if (event.key === 'ArrowRight') {
        goToNext();
      } else if (event.key === 'ArrowLeft') {
        goToPrev();
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fetchedQuestion]); // Re-run when fetchedQuestion changes

  const handleOptionClick = (option) => {
    alert(`Selected option: ${option}`);
  };

  //TODO: Handle loading data time rather than just potential nulls
  return (
    <div {...handlers} className="w-full bg-gray-200 flex flex-col">
      <QuestionHeader
        questionNumber={fetchedQuestion?.content.id}
        totalQuestions={fetchedQuestion?.articleIndex}
        taskType={capitalise(fetchedQuestion?.content.type)}
      />
      {/* TODO: Handle polls */}
      {(fetchedQuestion?.content.type === "question") && (
        <QuestionContent content={fetchedQuestion?.content || {}} />
      )}
      {(fetchedQuestion?.content.type === "poll") && (
        <PollContent content={fetchedQuestion?.content || {}} />
      )}
    </div>
  );
}
