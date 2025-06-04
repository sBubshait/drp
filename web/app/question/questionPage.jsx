import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import QuestionHeader from "../components/question_elements/questionHeader.jsx";
import QuestionContent from "../components/site_layout/questionContent.jsx";
import PollContent from "../components/site_layout/pollContent.jsx";

export function QuestionPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fetchedQuestion, setFetchedQuestion] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  
  // Get segments from location state
  const segments = location.state?.segments || [];
  const articleId = params.id;
  
  function capitalise(s) {
    return s && String(s[0]).toUpperCase() + String(s).slice(1);
  }

  // Set question based on current index using actual segment data
  useEffect(() => {
    if (segments.length > 0 && currentIndex < segments.length) {
      const currentSegment = segments[currentIndex];
      // Use the segment data directly as the question
      setFetchedQuestion({
        content: currentSegment,
        articleIndex: segments.length,
        segmentIndex: currentIndex + 1
      });
    }
  }, [currentIndex, segments]);

  // Navigation functions
  const goToNext = () => {
    if (currentIndex < segments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // Navigate back to article page if on first question
      navigate(`/article`, {
        state: {
          articleId: articleId
        }
      });
    }
  };

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: goToNext,        // Swipe left to go to next question
    onSwipedRight: goToPrev,       // Swipe right to go to previous question or back to article
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true // This enables mouse dragging for testing on desktop
  });

  useEffect(() => {
    if (segments.length > 0) {
      setCurrentIndex(0);
    } 
  }, [segments]);

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
  }, [fetchedQuestion, currentIndex]); // Re-run when fetchedQuestion or currentIndex changes

  // Loading state
  if (segments.length === 0 && !fetchedQuestion) {
    return (
      <div className="w-full bg-gray-200 flex flex-col min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading questions...</p>
      </div>
    );
  }

  // No segments available
  if (segments.length === 0) {
    return (
      <div className="w-full bg-gray-200 flex flex-col min-h-screen items-center justify-center">
        <p className="text-gray-600">No article segments found. Please start from an article.</p>
        <button 
          onClick={() => navigate('/article')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Article
        </button>
      </div>
    );
  }

  //TODO: Handle loading data time rather than just potential nulls
  return (
    <div {...handlers} className="w-full bg-gray-200 flex flex-col">
      <QuestionHeader
        questionNumber={currentIndex + 1}
        totalQuestions={segments.length}
        taskType={capitalise(segments[currentIndex]?.content.type)}
      />
      
      {/* Render based on content type */}
      {(segments[currentIndex]?.content.type === "question") && (
        <QuestionContent content={segments[currentIndex]?.content || {}} />
      )}
      {(segments[currentIndex]?.content.type === "poll") && (
        <PollContent content={segments[currentIndex]?.content || {}} />
      )}
    </div>
  );
}
