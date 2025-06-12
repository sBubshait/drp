import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import QuestionHeader from "../components/question_elements/questionHeader.jsx";
import QuestionContent from "../components/site_layout/questionContent.jsx";
import PollContent from "../components/site_layout/pollContent.jsx";
import InfoContent from '../components/site_layout/infoContent.jsx';
import DiscussionContent from "../components/site_layout/discussionContent.jsx";
import GapfillContent from '../components/site_layout/gapFillContent.jsx';
import ApiService from '../services/api.js';
import { SourcesContent } from "../components/question_elements/SourcesContent.jsx"

// Component map for different content types
const CONTENT_COMPONENTS = {
  question: QuestionContent,
  poll: PollContent,
  discussion: DiscussionContent,
  info: InfoContent,
  gap_fill: GapfillContent
};

export function QuestionPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSourcesSheet, setShowSourcesSheet] = useState(false);
  const [currentSources, setCurrentSources] = useState([]);
  const [sourcesLoading, setSourcesLoading] = useState(false);
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

  useEffect(() => {
    if (segments.length > 0 && segments[currentIndex]) {
      fetchSourcesForCurrentSegment();
    }
  }, [currentIndex, segments]);

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

  // Fetch sources for the current segment
  const fetchSourcesForCurrentSegment = async () => {
    if (!segments[currentIndex]?.id) {
      setCurrentSources([]);
      return;
    }

    setSourcesLoading(true);
    try {
      const data = await ApiService.getSources(segments[currentIndex].id);
      setCurrentSources(data.sources || []);
    } catch (error) {
      console.error('Error fetching sources:', error);
      setCurrentSources([]);
    } finally {
      setSourcesLoading(false);
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

  // Add this helper function at the top of your QuestionPage component:
  const isSwipeExcluded = (target) => {
    const excludedElements = [
      document.getElementById('annotationSidebar'),
      document.getElementById('responseContainer')
    ];

    return excludedElements.some(element =>
      element && element.contains(target)
    );
  };

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      if (isSwipeExcluded(eventData.event.target)) {
        return;
      }
      goToNext();
    },
    onSwipedRight: (eventData) => {
      if (isSwipeExcluded(eventData.event.target)) {
        return;
      }
      goToPrev();
    },
    onSwipedUp: (eventData) => {
      if (isSwipeExcluded(eventData.event.target)) {
        return;
      }
    },
    onSwipedDown: (eventData) => {
      if (isSwipeExcluded(eventData.event.target)) {
        return;
      }
    },
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
    delta: 50,
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
        onSourcesClick={() => setShowSourcesSheet(true)}
        hasSourcesData={currentSources.length > 0}
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

      {showSourcesSheet && (
        <SourcesBottomSheet
          sources={currentSources}
          loading={sourcesLoading}
          onClose={() => setShowSourcesSheet(false)}
        />
      )}
    </div>
  );
}

function SourcesBottomSheet({ sources, loading, onClose }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-end justify-center"
      onClick={handleBackdropClick}
    >
      <div
        id="sourcesBottomSheet"
        className="bg-gray-200 w-full md:max-w-md lg:max-w-2xl h-3/4 rounded-t-2xl flex flex-col animate-slide-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white hover:bg-gray-100 text-black rounded-full flex items-center justify-center transition-colors shadow-md z-10"
        >
          ✕
        </button>

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0 p-4 pt-12">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-600">Loading sources...</p>
            </div>
          ) : sources.length > 0 ? (
            <SourcesContent sources={sources} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-600">No sources available for this segment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}