import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useNavigate, useParams } from 'react-router';
import QuestionHeader from "../components/question_elements/questionHeader.jsx";
import VerticalVideoPlayer from "../components/site_layout/videoPlayer.jsx";
import ArticlePreview from '../components/site_layout/articlePreview.jsx';
import NoMatchingArticles from '../components/site_layout/noMatchingArticles.jsx';
import ApiService from '../services/api.js';
import { calculateArticleCategories } from '../utils/categoryUtils.js';

export function ArticlePage() {
  const navigate = useNavigate();
  const params = useParams();
  const [fetchedArticle, setFetchedArticle] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTip, setShowTip] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [noMatchingArticles, setNoMatchingArticles] = useState(false);

  // Available filter options
  const filterOptions = ['All', 'Popular', 'Recent', 'Hot', 'Technology', 'Health', 'Politics', 'Science'];

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

  // Helper function to check if article matches the current filter
  const articleMatchesFilter = (article) => {
    if (selectedFilter === 'All') return true;
    const categories = calculateArticleCategories(article);
    return categories.includes(selectedFilter);
  };

  // Function to fetch article by ID from API using the service layer
  const fetchArticle = async (id, visitedIds = new Set()) => {
    setLoading(true);
    setError(null);
    setNoMatchingArticles(false);

    try {
      const data = await ApiService.getArticle(id);
      
      // Check if the article matches the current filter
      if (!articleMatchesFilter(data.article)) {
        // Add current article ID to visited set to prevent infinite loops
        visitedIds.add(id);
        
        // If it doesn't match, automatically navigate to the next article
        if (data.next && !visitedIds.has(data.next)) {
          await fetchArticle(data.next, visitedIds);
          return;
        } else {
          // No more articles to check and no matches found
          setNoMatchingArticles(true);
          setLoading(false);
          return;
        }
      }
      
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

  // Handle filter selection
  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setShowFilterMenu(false);
    
    // Reset to article 1 when filter changes (unless it's 'All')
    if (filter !== 'All') {
      navigate('/articles/1');
    }
  };

  // Handle go to first article
  const handleGoToFirstArticle = () => {
    setSelectedFilter('All');
    navigate('/articles/1');
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
    fetchArticle(articleId || 1);
  }, [articleId, selectedFilter]);

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
        <p className="text-gray-600">Loading articles...</p>
        {selectedFilter !== 'All' && (
          <p className="text-gray-500 text-sm mt-2">Filtering by: {selectedFilter}</p>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gray-200 flex flex-col min-h-screen items-center justify-center">
        <p className="text-red-600 font-semibold">Error loading article</p>
        <p className="text-gray-500 text-sm mt-2">{error}</p>
        <button
          onClick={() => fetchArticle(articleId || 1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // No matching articles found
  if (noMatchingArticles) {
    return (
      <NoMatchingArticles
        selectedFilter={selectedFilter}
        filterOptions={filterOptions}
        showFilterMenu={showFilterMenu}
        setShowFilterMenu={setShowFilterMenu}
        handleFilterSelect={handleFilterSelect}
        onGoToFirstArticle={handleGoToFirstArticle}
      />
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
  
  // Calculate categories for the current article
  const articleCategories = calculateArticleCategories(fetchedArticle.article);

  console.log('Fetched Article:', fetchedArticle);
  console.log('Article Categories:', articleCategories);
  console.log('Current Filter:', selectedFilter);

  return (
    <div {...handlers} className="w-full bg-gray-200 flex flex-col min-h-screen overflow-hidden relative">
      {/* Header with Filter */}
      <div className="flex">
        <div className="bg-gray-800 px-6 py-3 text-white font-bold text-lg flex-1 flex justify-between items-center">
          <span>PoliticoApp</span>
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm flex items-center gap-2"
            >
              <span>Filter: {selectedFilter}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showFilterMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg border z-50 min-w-[120px]">
                {filterOptions.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleFilterSelect(filter)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      selectedFilter === filter ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>
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
                categories={articleCategories}
              />
            </div>
          </div>
        ) : (
          /* Text Article Layout - Centered */
          <ArticlePreview article={fetchedArticle.article} categories={articleCategories} />
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
              {isVideoArticle && (
                <span className="block mt-1 text-xs">
                  Categories: {articleCategories.join(', ')}
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}