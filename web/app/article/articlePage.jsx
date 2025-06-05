import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useNavigate, useParams } from 'react-router';
import QuestionHeader from "../components/question_elements/questionHeader.jsx";
import VerticalVideoPlayer from "../components/site_layout/videoPlayer.jsx";
import ApiService from '../services/api.js';

export function ArticlePage() {
  const navigate = useNavigate();
  const params = useParams();
  const [fetchedArticle, setFetchedArticle] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTip, setShowTip] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const tipDismissed = localStorage.getItem('tipDismissed');
    if (tipDismissed === 'true') {
      setShowTip(false);
    }
  }, []);

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
        {/* <p className="text-gray-600">Loading article...</p>
        <p className="text-gray-500 text-sm mt-2">
          {articleId
            ? `Fetching article ${articleId} from API...`
            : `Fetching default article from API...`
          }
        </p> */}
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
    <div {...handlers} className="w-full bg-gray-200 flex flex-col min-h-screen overflow-hidden">
      {/* Header */}
      <div className="flex">
        <div className="bg-gray-800 px-6 py-3 text-white font-bold text-lg flex-1">
          PoliticoApp
        </div>
      </div>

      <div
        className={`flex-1 flex flex-col justify-center items-center px-6 transition-all duration-300 ease-out ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
          }`}
      >
        {!isVideoArticle ? (
          /* Video Article Layout */
          <div className="flex flex-col items-center space-y-4 max-w-md w-full">

            {/* Video Player */}
            <VerticalVideoPlayer
              videoUrl={"https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"}
            />

          </div>
        ) : (
          /* Text Article Layout */
          <div className="text-center space-y-4 max-w-md">
            {/* Category Tag */}
            <div>
              <span className="inline-block px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide text-white" style={{ backgroundColor: '#00ADB5' }}>
                {fetchedArticle.article.category}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl font-bold text-gray-800 leading-tight">
              {fetchedArticle.article.content}
            </h1>

            {/* Date */}
            <div className="text-gray-600 text-sm font-medium">
              Today at 12:00 PM
            </div>
          </div>
        )}
      </div>

      {/* Closeable Tip Box */}
      {showTip && (
        <div className="p-6">
          <div className="bg-blue-50 rounded-lg border-l-4 border-blue-400 p-4 relative">
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