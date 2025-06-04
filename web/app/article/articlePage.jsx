import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useNavigate, useParams } from 'react-router';
import QuestionHeader from "../components/question_elements/questionHeader.jsx";

export function ArticlePage() {
  const navigate = useNavigate();
  const params = useParams();
  const [fetchedArticle, setFetchedArticle] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get article ID from URL params, null if not provided
  const articleId = params.id ? parseInt(params.id, 10) : null;

  // Function to fetch article by ID from API
  const fetchArticle = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use different endpoints based on whether ID is provided
      const url = id 
        ? `https://api.saleh.host/getArticle?id=${id}`
        : `https://api.saleh.host/getArticle`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 200) {
        throw new Error(`API error! status: ${data.status}`);
      }
      
      // Use the API response structure directly
      const transformedArticle = {
        id: data.article.id,
        title: data.article.content, // API uses 'content' field as the title
        body: `Category: ${data.article.category}\n\nThis article covers ${data.article.category.toLowerCase()} topics. Navigate through the questions to explore different perspectives on this subject.`,
        category: data.article.category,
        type: data.article.type,
        prev: data.prev,
        next: data.next,
        segments: data.article.segments || []
      };
      
      setFetchedArticle(transformedArticle);
    } catch (error) {
      console.error('Error fetching article:', error);
      setError(error.message);
      
      // Fallback to a basic article structure on error
      const fallbackArticle = {
        id: id || 1,
        title: `Article ${id || 'Default'} (Error Loading)`,
        body: `Unable to load article ${id ? `${id}` : ''}. Please try again later.`,
        category: "Unknown",
        type: "text",
        prev: id && id > 1 ? id - 1 : null,
        next: (id || 1) + 1,
        segments: []
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

  // Navigation function for swipe to questions - now passes segments and next article ID in state
  const goToQuestions = () => {
    const questionUrl = articleId 
      ? `/articles/${articleId}/questions`
      : `/articles/${fetchedArticle.id}/questions`;
      
    navigate(questionUrl, {
      state: {
        segments: fetchedArticle.segments,
        nextArticleId: fetchedArticle.next,
        articleId: articleId || fetchedArticle.id,
        articleTitle: fetchedArticle.title
      }
    });
  };

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: goToQuestions,     // Swipe left to go to questions
    onSwipedRight: goToPrev,         // Swipe right to go to previous article
    onSwipedUp: goToNext,            // Swipe up to go to next article
    onSwipedDown: goToPrev,          // Swipe down to go to previous article
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true // This enables mouse dragging for testing on desktop
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

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
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
        questionNumber={fetchedArticle.id}
        totalQuestions={fetchedArticle.segments.length}
        taskType="Article Summary"
      />
      
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-md p-6 h-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {fetchedArticle.title}
          </h1>
          
          {fetchedArticle.category && (
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {fetchedArticle.category}
              </span>
            </div>
          )}
          
          <div className="text-gray-700 leading-relaxed space-y-4">
            {fetchedArticle.body.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          <div className="mt-8 space-y-4">
            {fetchedArticle.segments.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="text-blue-800 font-medium">
                  💡 Tip: Swipe left to proceed to {fetchedArticle.segments.length} question{fetchedArticle.segments.length !== 1 ? 's' : ''} about this article
                </p>
              </div>
            )}
            
            {fetchedArticle.segments.length === 0 && (
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