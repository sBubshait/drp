import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useNavigate, useParams } from 'react-router';
import QuestionHeader from "../components/question_elements/questionHeader.jsx";
import VerticalVideoPlayer from "../components/site_layout/videoPlayer.jsx";
import ArticlePreview from '../components/site_layout/articlePreview.jsx';
import ApiService from '../services/api.js';
import { initUid, getUserData } from '../services/userApi.js';
import StreakBeginTip from '../components/streak/streakBeginTip.jsx';'../components/streak/streakBeginTip.jsx'

export function ArticlePage() {
  const navigate = useNavigate();
  const params = useParams();
  const [fetchedArticle, setFetchedArticle] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTip, setShowTip] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    initUid().then ((uid) => {
      checkStreak(uid);
    });

    initTip();
  }, []);

  const checkStreak = (uid) => {
    const userData = getUserData(uid);
  }

  const initTip = () => {
    const tipDismissed = localStorage.getItem('tipDismissed');
    if (tipDismissed === 'true') {
      setShowTip(false);
    }
  }

  const handleCloseTip = () => {
    setShowTip(false);
    localStorage.setItem('tipDismissed', 'true');
  };

  // Get article ID from URL params, null if not provided
  const articleId = params.id ? parseInt(params.id, 10) : null;

  // Function to fetch article by ID from API using the service layer
  const fetchArticle = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const data = await ApiService.getArticle(id);
      setFetchedArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
      setError(error.message);

      // Fallback to a basic article structure on error
      const fallbackArticle = {
        status: 200,
        prev: id && id > 1 ? id - 1 : null,
        next: (id || 1) + 1,
        article: {
          id: id || 1,
          content: `Article ${id || 'Default'} (Error Loading)`,
          category: "Unknown",
          type: "text",
          segments: []
        }
      };

      setFetchedArticle(fallbackArticle);
    } finally {
      setLoading(false);
    }
  };

  // Navigation functions with animation
  const goToNext = () => {
    if (isAnimating || !fetchedArticle?.next) return;

    setIsAnimating(true);
    setTimeout(() => {
      navigate(`/articles/${fetchedArticle.next}`);
      setIsAnimating(false);
    }, 150);
  };

  const goToPrev = () => {
    if (isAnimating || !fetchedArticle?.prev) return;

    setIsAnimating(true);
    setTimeout(() => {
      navigate(`/articles/${fetchedArticle.prev}`);
      setIsAnimating(false);
    }, 150);
  };

  // Navigation function for swipe to questions
  const goToQuestions = () => {
    if (isAnimating) return;

    const questionUrl = articleId
      ? `/articles/${articleId}/questions`
      : `/articles/${fetchedArticle.article.id}/questions`;

    navigate(questionUrl, {
      state: {
        segments: fetchedArticle.article.segments,
        nextArticleId: fetchedArticle.next,
        articleId: articleId || fetchedArticle.article.id,
        articleTitle: fetchedArticle.article.content
      }
    });
  };

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: goToQuestions,
    onSwipedUp: goToNext,
    onSwipedDown: goToPrev,
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  // Fetch article when component mounts or articleId changes
  useEffect(() => {
    fetchArticle(articleId);
  }, [articleId]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!fetchedArticle || loading || isAnimating) return;

      if (event.key === 'ArrowRight') {
        goToNext();
      } else if (event.key === 'ArrowLeft') {
        goToPrev();
      } else if (event.key === 'Enter') {
        goToQuestions();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fetchedArticle, loading, isAnimating]);

  if (loading) {
    return (
      <div className="w-full bg-gray-200 flex flex-col min-h-screen items-center justify-center">
        {/* Loading state */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gray-200 flex flex-col min-h-screen items-center justify-center">
        <p className="text-red-600 font-semibold">Error loading article</p>
        <p className="text-gray-500 text-sm mt-2">{error}</p>
        <button
          onClick={() => fetchArticle(articleId)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!fetchedArticle) {
    return (
      <div className="w-full bg-gray-200 flex flex-col min-h-screen items-center justify-center">
        <p className="text-gray-600">No article data available</p>
      </div>
    );
  }

  const isVideoArticle = fetchedArticle.article.type === 'video';

  return (
    <div {...handlers} className="w-full bg-gray-200 flex flex-col min-h-screen overflow-hidden relative">
      {/* Header */}
      <div className="flex">
        <div className="bg-gray-800 px-6 py-3 text-white font-bold text-lg flex-1">
          PoliticoApp
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col justify-center items-center relative transition-all duration-300 ease-out ${
          isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
        }`}
      >
        {isVideoArticle ? (
          /* Video Article Layout - Full Screen */
          <div className="w-full h-full relative">
            {/* Video Player - Takes full available space */}
            <div className="w-full h-full p-4">
              <VerticalVideoPlayer
                videoUrl={fetchedArticle.article.content}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <StreakBeginTip className="relative bottom-42" />
            <ArticlePreview article={fetchedArticle.article} />
          </div>
        )}
      </div>

      {/* Tip Box - Positioned absolutely over content */}
      {showTip && (
        <div className="absolute bottom-4 left-4 right-4 z-40">
          <div className="bg-blue-50 bg-opacity-95 backdrop-blur-sm rounded-lg border-l-4 border-blue-400 p-4 relative shadow-lg">
            <button
              onClick={handleCloseTip}
              className="absolute top-2 right-2 text-blue-600 hover:text-blue-800 font-bold text-lg"
            >
              ×
            </button>
            <p className="text-blue-800 font-medium pr-6">
              💡 Tip: {fetchedArticle.article.segments.length} interactive segment{fetchedArticle.article.segments.length !== 1 ? 's' : ''} available for this article. Swipe left!
              Swipe up and down to move between articles!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
