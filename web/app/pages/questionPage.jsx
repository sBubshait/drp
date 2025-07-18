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
import StreakMeter from '../components/streak/streakMeter.jsx';
import Flame from '../components/streak/flame.jsx'
import { StreakCompletedPage } from '../components/streak/streakCompletedPage.jsx';
import { completeStreak, getInteractedSegments, getMyData, interactWithSegment } from '../services/other.js';
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

  const [answeredSegments, setAnsweredSegments] = useState([]);
  const [streakArticle, setStreakArticle] = useState(location.state == null || location.state.initStreak === null ? false : location.state.initStreak);
  const [streakCompleted, setStreakCompleted] = useState(false);
  const currentSegment = segments[currentIndex];
  const totalSegments = segments.length;

  const [displayedStreak, setDisplayedStreak] = useState(null);

  var progress;
  for (progress = 0; progress < totalSegments; progress++) {
    if (!answeredSegments.includes(segments[progress].id)) break;
  }
  const fract = progress / totalSegments

  function capitalise(s) {
    return s && String(s[0]).toUpperCase() + String(s).slice(1);
  }

  function incrementXp(amount) {
    ApiService.incrementXp(amount).then(() => {
      console.log(`Incremented XP by ${amount}`);
      // XpDisplay now updates automatically via the event system and localStorage
    }).catch(error => {
      console.error('Error incrementing XP:', error);
    });
  }

  // Initialize segments from navigation state or fetch from API as fallback
  useEffect(() => {
    if (location.state?.segments) {
      setSegments(location.state.segments);
      try {
        getInteractedSegments(location.state?.articleId).then(
          resp => { setAnsweredSegments(resp.segments); setLoading(false) }
        )
      } catch { setLoading(false) }
    } else if (articleId) {
      fetchArticleData(articleId);
      try {
        getInteractedSegments(articleId).then(
          resp => { setAnsweredSegments(resp.segments); }
        )
      } catch { }
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
      // Handle streak completion first if this is a streak article and all segments are answered
      if (streakArticle && fract == 1 && !streakCompleted) {
        // First set flags
        setStreakArticle(false);
        setStreakCompleted(true);
        incrementXp(500);

        // Get user data, then setup animation with better delays
        getMyData().then((userData) => {
          // Delay setting the initial streak value to give component time to render
          setTimeout(() => {
            // Set the current streak value first
            setDisplayedStreak(userData.streak);
            
            // Add a longer delay before showing the increment (1.5 seconds)
            // This gives users time to see the initial number
            setTimeout(() => {
              setDisplayedStreak(userData.streak + 1);
            }, 1500);
          }, 800);
          
          // Call completeStreak after setting up the animation
          completeStreak();
        });
        
        // Don't navigate away yet - return to prevent further code execution
        return;
      } else {
        // Regular completion without streak or after showing streak
        if (fract == 1) {
          // User has completed the article
          incrementXp(100);
        }

        // Navigate to the next article if available - removed delay
        if (location.state?.nextArticleId) {
          navigate(`/article`, {
            state: {
              targetArticleId: location.state.nextArticleId,
              targetArticleIndex: location.state.nextArticleIndex,
              currentSort: location.state?.currentSort,
              currentFilters: location.state?.currentFilters
            }
          });
        } else {
          navigate(`/article`);
        }
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
      // Navigate back to the original article the user was viewing
      navigate(`/article`, {
        state: {
          targetArticleId: location.state?.articleId,
          targetArticleIndex: location.state?.originalArticleIndex,
          currentSort: location.state?.currentSort,
          currentFilters: location.state?.currentFilters
        }
      });
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
          onClick={() => navigate(`/article`, {
            state: {
              targetArticleId: location.state?.articleId,
              targetArticleIndex: location.state?.originalArticleIndex,
              currentSort: location.state?.currentSort,
              currentFilters: location.state?.currentFilters
            }
          })}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Article
        </button>
      </div>
    );
  }

  const contentType = currentSegment?.content?.type || currentSegment?.type;
  const ContentComponent = CONTENT_COMPONENTS[contentType];

  return (
    <div {...handlers} className="h-screen w-full bg-gray-200 flex flex-col overflow-hidden">
      <QuestionHeader
        questionNumber={currentIndex + 1}
        totalQuestions={totalSegments}
        taskType={capitalise(contentType)}
        onSourcesClick={() => setShowSourcesSheet(true)}
        hasSourcesData={currentSources.length > 0}
        articleId={articleId}
        segmentId={currentSegment?.id}
      />

      {streakArticle && <div className='text-center pt-[5%]'>
        <Flame className="inline-block px-[7%] scale-50" doBurst={fract == 1} burstDelay={900} />
        <StreakMeter className='inline-block max-w-78/100'
          height="h-7"
          barColor="bg-red-400"
          value={fract * 100}
          duration={1000}
        />
      </div>}

      <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
        <div
          className={`flex-1 flex flex-col ${contentType !== 'info' ? 'transition-all duration-300 ease-out' : ''} ${isAnimating && contentType !== 'info' ? 'opacity-0 transform translate-x-4' : (contentType !== 'info' ? 'opacity-100 transform translate-x-0' : '')
            }`}
        >
          {streakCompleted ? <StreakCompletedPage streakNo={displayedStreak} /> :
            ContentComponent ? (<ContentComponent content={currentSegment}
              interactCallback={(segmentId) => {
                interactWithSegment(segmentId);
                // Fix: use functional update to properly handle state updates with arrays
                setAnsweredSegments(prev => [...prev, segmentId]);
                incrementXp(10);
              }}
            />) :
              (<div className="flex-1 flex items-center justify-center">
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
