import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useNavigate, useParams } from 'react-router';
import VerticalVideoPlayer from "../components/site_layout/videoPlayer.jsx";
import ArticlePreview from '../components/site_layout/articlePreview.jsx';
import NoMatchingArticles from '../components/site_layout/noMatchingArticles.jsx';
import FilterSection from '../components/site_layout/filterSection.jsx';
import ApiService from '../services/api.js';
import { calculateArticleCategories } from '../utils/categoryUtils.js';
import StreakBeginTip from '../components/streak/streakBeginTip.jsx';'../components/streak/streakBeginTip.jsx'
import { getStreakCond, swipeRight } from '../services/other.js';
import XpDisplay from '../components/common/XpDisplay.jsx';

export function ArticlePage() {
  const navigate = useNavigate();
  const params = useParams();
  const [fetchedArticle, setFetchedArticle] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTip, setShowTip] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [noMatchingArticles, setNoMatchingArticles] = useState(false);
  const [matchingArticleIds, setMatchingArticleIds] = useState(new Set()); // Track matching articles

  // Sort by state
  const [selectedSort, setSelectedSort] = useState('Popular');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Add a state to control visibility of both menus
  const [showMenus, setShowMenus] = useState(true);

  // Available filter options (removed Popular, Recent, Hot)
  const filterOptions = ['Technology', 'Environment', 'Global Politics', 'Economics', 'Social Issues'];
  const [streakStatus, setStreakStatus] = useState(0);

  useEffect(() => {
    initTip();
    getStreakCond().then((resp) => {setStreakStatus(resp.id)});
  }, []);

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

  // Helper function to check if article matches ALL selected filters
  const articleMatchesFilter = (article) => {
    if (selectedFilters.length === 0) return true; // No filters = show all
    
    const categories = calculateArticleCategories(article);
    
    // Article must match ALL selected filters
    return selectedFilters.every(filter => categories.includes(filter));
  };

  // Reset matching articles when filters change
  useEffect(() => {
    setMatchingArticleIds(new Set());
  }, [selectedFilters]);

  // Function to fetch article by ID from API using the service layer
  const fetchArticle = async (id, visitedIds = new Set(), direction = 'forward') => {
    setLoading(true);
    setError(null);
    setNoMatchingArticles(false);

    try {
      const data = await ApiService.getArticle(id);
      
      // Check if the article matches the current filters
      if (!articleMatchesFilter(data.article)) {
        // Add current article ID to visited set to prevent infinite loops
        visitedIds.add(id);
        
        // If it doesn't match, try to navigate to the next/previous article
        const nextId = direction === 'forward' ? data.next : data.prev;
        
        if (nextId && !visitedIds.has(nextId)) {
          await fetchArticle(nextId, visitedIds, direction);
          return;
        } else {
          // No more articles in this direction
          if (direction === 'forward' && matchingArticleIds.size > 0) {
            // We've reached the end, cycle back to the earliest matching article
            const earliestMatchingId = Math.min(...Array.from(matchingArticleIds));
            console.log(`Cycling back to earliest matching article: ${earliestMatchingId}`);
            navigate(`/articles/${earliestMatchingId}`);
            return;
          } else if (direction === 'backward' && matchingArticleIds.size > 0) {
            // We've reached the beginning, cycle to the latest matching article
            const latestMatchingId = Math.max(...Array.from(matchingArticleIds));
            console.log(`Cycling forward to latest matching article: ${latestMatchingId}`);
            navigate(`/articles/${latestMatchingId}`);
            return;
          } else {
            // No matching articles found at all
            setNoMatchingArticles(true);
            setLoading(false);
            return;
          }
        }
      }
      
      // Article matches - add to matching articles set and display it
      setMatchingArticleIds(prev => new Set([...prev, data.article.id]));
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

  // Navigation functions with animation and direction awareness
  const goToNext = () => {
    if (isAnimating || !fetchedArticle?.next) return;

    setIsAnimating(true);
    setTimeout(() => {
      // Use fetchArticle to handle filtering and cycling
      const nextId = fetchedArticle.next;
      if (nextId) {
        fetchArticle(nextId, new Set(), 'forward');
      }
      setIsAnimating(false);
    }, 150);
  };

  const goToPrev = () => {
    if (isAnimating || !fetchedArticle?.prev) return;

    setIsAnimating(true);
    setTimeout(() => {
      // Use fetchArticle to handle filtering and cycling
      const prevId = fetchedArticle.prev;
      if (prevId) {
        fetchArticle(prevId, new Set(), 'backward');
      }
      setIsAnimating(false);
    }, 150);
  };

  // Navigation function for swipe to questions
  const goToQuestions = () => {
    if (isAnimating) return;

    const questionUrl = articleId
      ? `/articles/${articleId}/questions`
      : `/articles/${fetchedArticle.article.id}/questions`;

    swipeRight(articleId);

    navigate(questionUrl, {
      state: {
        segments: fetchedArticle.article.segments,
        nextArticleId: fetchedArticle.next,
        articleId: articleId || fetchedArticle.article.id,
        articleTitle: fetchedArticle.article.content,
        initStreak: streakStatus > 0
      }
    });
  };

  // Handle filter toggle
  const handleFilterToggle = (filter) => {
    setSelectedFilters(prev => {
      const newFilters = prev.includes(filter)
        ? prev.filter(f => f !== filter) // Remove if already selected
        : [...prev, filter]; // Add if not selected
      
      // Reset to article 1 when filters change
      if (newFilters.length > 0) {
        navigate('/articles/1');
      }
      
      return newFilters;
    });
  };

  // Handle clear all filters
  const handleClearFilters = () => {
    setSelectedFilters([]);
    setShowFilterMenu(false);
  };

  // Handle go to first article
  const handleGoToFirstArticle = () => {
    setSelectedFilters([]);
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
  }, [articleId, selectedFilters]);

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

  // Format filter display text
  const getFilterDisplayText = () => {
    if (selectedFilters.length === 0) return 'All';
    if (selectedFilters.length === 1) return selectedFilters[0];
    return `${selectedFilters.length} filters`;
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-200 flex flex-col min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading articles...</p>
        {selectedFilters.length > 0 && (
          <p className="text-gray-500 text-sm mt-2">
            Filtering by: {selectedFilters.join(' + ')}
          </p>
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
        selectedFilters={selectedFilters}
        filterOptions={filterOptions}
        showFilterMenu={showFilterMenu}
        setShowFilterMenu={setShowFilterMenu}
        handleFilterToggle={handleFilterToggle}
        handleClearFilters={handleClearFilters}
        onGoToFirstArticle={handleGoToFirstArticle}
        getFilterDisplayText={getFilterDisplayText}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        showSortMenu={showSortMenu}
        setShowSortMenu={setShowSortMenu}
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
  console.log('Selected Filters:', selectedFilters);
  console.log('Selected Sort:', selectedSort);
  console.log('Matching Article IDs:', Array.from(matchingArticleIds));

  return (
    <div {...handlers} className="w-full bg-gray-200 flex flex-col min-h-screen overflow-hidden relative">
      {/* Header - simplified without filter */}
      <div className="flex">
        <div className="bg-gray-800 px-6 py-3 text-white font-bold text-lg flex-1">
          PoliticoApp
        </div>
        <div className="bg-gray-800 px-6 py-3 flex items-center">
          <XpDisplay articleId={articleId} />
        </div>
      </div>

      {/* Filter, Sort, and Toggle Button Row */}
      <div className="flex items-center gap-4 px-6 py-2">
        <div className="flex-1">
          {showMenus && (
            <FilterSection
              selectedFilters={selectedFilters}
              filterOptions={filterOptions}
              showFilterMenu={showFilterMenu}
              setShowFilterMenu={setShowFilterMenu}
              handleFilterToggle={handleFilterToggle}
              handleClearFilters={handleClearFilters}
              getFilterDisplayText={getFilterDisplayText}
              selectedSort={selectedSort}
              setSelectedSort={setSelectedSort}
              showSortMenu={showSortMenu}
              setShowSortMenu={setShowSortMenu}
            />
          )}
        </div>
        {/* Toggle Menus Button - always right aligned */}
        <button
          onClick={() => setShowMenus((prev) => !prev)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xl flex items-center justify-center"
          aria-label={showMenus ? 'Hide Filters & Sort' : 'Show Filters & Sort'}
        >
          {showMenus ? (
            // "Eye with slash" icon for hide
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7.5a11.72 11.72 0 012.91-4.36M6.53 6.53A9.98 9.98 0 0112 5c5 0 9.27 3.11 11 7.5a11.72 11.72 0 01-4.17 5.19M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18" />
            </svg>
          ) : (
            // "Eye" icon for show
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1.458 12C2.732 7.943 6.523 5 12 5c5.477 0 9.268 2.943 10.542 7-1.274 4.057-5.065 7-10.542 7-5.477 0-9.268-2.943-10.542-7z" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} fill="none"/>
            </svg>
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col justify-center items-center relative transition-all duration-300 ease-out ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
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
          <div className="flex flex-col">
            <StreakBeginTip className="relative bottom-42" streakStatus={streakStatus} />
            <ArticlePreview article={fetchedArticle.article} categories={articleCategories}/>
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
