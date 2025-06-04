import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useNavigate, useParams } from 'react-router';
import QuestionHeader from "../components/question_elements/questionHeader.jsx";
import ApiService from '../services/api.js';

export function ArticlePage() {
  const navigate = useNavigate();
  const params = useParams();
  const [fetchedArticle, setFetchedArticle] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Navigation functions
  const goToNext = () => {
    if (fetchedArticle?.next) {
      navigate(`/articles/${fetchedArticle.next}`);
    }
  };

  const goToPrev = () => {
    if (fetchedArticle?.prev) {
      navigate(`/articles/${fetchedArticle.prev}`);
    }
  };

  // Navigation function for swipe to questions
  const goToQuestions = () => {
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
      if (!fetchedArticle || loading) return;

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
  }, [fetchedArticle, loading]);

  if (loading) {
    return (
      <div className="w-full bg-gray-200 flex flex-col min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading article...</p>
        <p className="text-gray-500 text-sm mt-2">
          {articleId 
            ? `Fetching article ${articleId} from API...`
            : `Fetching default article from API...`
          }
        </p>
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

  return (
    <div {...handlers} className="w-full bg-gray-200 flex flex-col min-h-screen">
      <QuestionHeader
        questionNumber={fetchedArticle.article.id}
        totalQuestions={fetchedArticle.article.segments?.length || 0}
        taskType="Article Summary"
      />
      
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-md p-6 h-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {fetchedArticle.article.content}
          </h1>
          
          {fetchedArticle.article.category && (
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {fetchedArticle.article.category}
              </span>
            </div>
          )}
          
          <div className="mt-8 space-y-4">
            {fetchedArticle.article.segments?.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="text-blue-800 font-medium">
                  💡 Tip: Swipe left to proceed to {fetchedArticle.article.segments.length} question{fetchedArticle.article.segments.length !== 1 ? 's' : ''} about this article
                </p>
              </div>
            )}
            
            {(!fetchedArticle.article.segments || fetchedArticle.article.segments.length === 0) && (
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <p className="text-yellow-800 font-medium">
                  ℹ️ No questions available for this article
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}