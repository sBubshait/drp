import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import QuestionHeader from "../components/question_elements/questionHeader.jsx";
import QuestionContent from "../components/site_layout/questionContent.jsx";
import PollContent from "../components/site_layout/pollContent.jsx";

export function QuestionPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  
  // Get article ID from URL params
  const articleId = params.id ? parseInt(params.id, 10) : null;
  
  function capitalise(s) {
    return s && String(s[0]).toUpperCase() + String(s).slice(1);
  }

  // Initialize segments from navigation state or fetch from API as fallback
  useEffect(() => {
    if (location.state?.segments) {
      // Use segments passed from ArticlePage
      console.log('Using segments from navigation state');
      setSegments(location.state.segments);
      setLoading(false);
    } else if (articleId) {
      // Fallback: fetch article data if no segments in state (direct navigation)
      console.log('No segments in state, fetching from API');
      fetchArticleData(articleId);
    } else {
      // No article ID and no state
      setLoading(false);
    }
    
    // Reset to first question when segments change
    setCurrentIndex(0);
  }, [location.state, articleId]);

  // Fallback function to fetch article data if segments not provided in state
  const fetchArticleData = async (id) => {
    setLoading(true);
    try {
      console.log(`Fetching article data for ID: ${id}`);
      
      const response = await fetch(`https://api.saleh.host/getArticle?id=${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 200) {
        throw new Error(`API error! status: ${data.status}`);
      }
      
      // Extract segments from API response
      setSegments(data.article.segments || []);
    } catch (error) {
      console.error('Error fetching article data:', error);
      setSegments([]);
    } finally {
      setLoading(false);
    }
  };

  // Navigation functions
  const goToNext = () => {
    if (currentIndex >= segments.length - 1) {
      // Navigate to the next article or back to current article
      navigate(`/articles/${articleId}`);
      return;
    }
    if (currentIndex < segments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // Navigate back to article page if on first question
      navigate(`/articles/${articleId}`);
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

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (loading || segments.length === 0) return;

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
  }, [loading, segments.length, currentIndex]);

  // Loading state
  if (loading) {
    return (
      <div className="w-full bg-gray-200 flex flex-col min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading questions...</p>
        {articleId && (
          <p className="text-gray-500 text-sm mt-2">Loading questions for article {articleId}...</p>
        )}
      </div>
    );
  }

  // No article ID
  if (!articleId) {
    return (
      <div className="w-full bg-gray-200 flex flex-col min-h-screen items-center justify-center">
        <p className="text-gray-600">No article ID provided.</p>
        <button 
          onClick={() => navigate('/articles/10/questions')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Default Article Questions
        </button>
      </div>
    );
  }

  // No segments available
  if (segments.length === 0) {
    return (
      <div className="w-full bg-gray-200 flex flex-col min-h-screen items-center justify-center">
        <p className="text-gray-600">No questions found for this article.</p>
        <button 
          onClick={() => navigate(`/articles/${articleId}`)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Article
        </button>
      </div>
    );
  }

  return (
    <div {...handlers} className="w-full bg-gray-200 flex flex-col">
      <QuestionHeader
        questionNumber={currentIndex + 1}
        totalQuestions={segments.length}
        taskType={capitalise(segments[currentIndex]?.content?.type || segments[currentIndex]?.type)}
      />
      
      {/* Render based on content type */}
      {(segments[currentIndex]?.type === "question") && (
        <QuestionContent content={segments[currentIndex]} />
      )}
      {(segments[currentIndex]?.type === "poll") && (
        <PollContent content={segments[currentIndex]} />
      )}
    </div>
  );
}
