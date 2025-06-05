import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import QuestionHeader from "../components/question_elements/questionHeader.jsx";
import QuestionContent from "../components/site_layout/questionContent.jsx";
import PollContent from "../components/site_layout/pollContent.jsx";
import InfoContent from '../components/site_layout/infoContent.jsx';
import DiscussionContent from "../components/site_layout/discussionContent.jsx";
import ApiService from '../services/api.js';

// Component map for different content types
const CONTENT_COMPONENTS = {
  question: QuestionContent,
  poll: PollContent,
  discussion: DiscussionContent,
  info: InfoContent
};

export function QuestionPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const articleId = params.id ? parseInt(params.id, 10) : null;
  const nextArticleId = location.state?.nextArticleId;

  function capitalise(s) {
    return s && String(s[0]).toUpperCase() + String(s).slice(1);
  }

  // Initialize segments from navigation state or fetch from API as fallback
  useEffect(() => {
    if (location.state?.segments) {
      setSegments(location.state.segments);
      setLoading(false);
    } else if (articleId) {
      fetchArticleData(articleId);
    } else {
      setLoading(false);
    }

    setCurrentIndex(0);
  }, [location.state, articleId]);

  // Fallback function to fetch article data using API service
  const fetchArticleData = async (id) => {
    setLoading(true);
    try {
      const data = await ApiService.getArticle(id);
      setSegments(data.article.segments || []);
    } catch (error) {
      console.error('Error fetching article data:', error);
      setSegments([]);
    } finally {
      setLoading(false);
    }
  };

  // Navigation functions with animation
  const goToNext = (event) => {
    if (isAnimating) return;

    if (currentIndex < segments.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsAnimating(false);
      }, 150);
    } else {
      if (nextArticleId) {
        navigate(`/articles/${nextArticleId}`);
      } else {
        navigate(`/articles/${articleId}`);
      }
    }
  };

  const goToPrev = () => {
    if (isAnimating) return;

    if (currentIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setIsAnimating(false);
      }, 150);
    } else {
      navigate(`/articles/${articleId}`);
    }
  };

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      const target = eventData.event.target;
      const annotationSidebar = document.getElementById('annotationSidebar');
      if (annotationSidebar && annotationSidebar.contains(target)) {
        return;
      }
      goToNext();
    },
    onSwipedRight: (eventData) => {
      const target = eventData.event.target;
      const annotationSidebar = document.getElementById('annotationSidebar');
      if (annotationSidebar && annotationSidebar.contains(target)) {
        return;
      }
      goToPrev();
    },
    swipeDuration: 500,
    preventScrollOnSwipe: true, // Don't prevent scrolling globally
    trackMouse: true,
    delta: 50, // Higher threshold for intentional swipes
    preventDefaultTouchmoveEvent: false,
    touchEventOptions: { passive: true }
  });

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (loading || segments.length === 0 || isAnimating) return;

      if (event.key === 'ArrowRight') {
        goToNext();
      } else if (event.key === 'ArrowLeft') {
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, segments.length, currentIndex, nextArticleId, isAnimating]);

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

  const currentSegment = segments[currentIndex];
  const contentType = currentSegment?.content?.type || currentSegment?.type;
  const ContentComponent = CONTENT_COMPONENTS[contentType];

  return (
    <div {...handlers} className="h-screen w-full bg-gray-200 flex flex-col overflow-hidden">
      <QuestionHeader
        questionNumber={currentIndex + 1}
        totalQuestions={segments.length}
        taskType={capitalise(contentType)}
      />

      <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
        <div
          className={`flex-1 flex flex-col ${contentType !== 'info' ? 'transition-all duration-300 ease-out' : ''} ${isAnimating && contentType !== 'info' ? 'opacity-0 transform translate-x-4' : (contentType !== 'info' ? 'opacity-100 transform translate-x-0' : '')
            }`}
        >
          {ContentComponent ? (
            <ContentComponent content={currentSegment} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-red-600 text-sm">Unknown content type: {contentType}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}