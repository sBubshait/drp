import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useNavigate, useParams } from 'react-router';
import VerticalVideoPlayer from "../components/site_layout/videoPlayer.jsx";
import ArticlePreview from '../components/site_layout/articlePreview.jsx';
import AppHeader from '../components/site_layout/AppHeader.jsx';
import NoMatchingArticles from '../components/site_layout/noMatchingArticles.jsx';
import FilterSection from '../components/site_layout/filterSection.jsx';
import ArticleTip from '../components/site_layout/ArticleTip.jsx';
import FilterMenuToggle from '../components/site_layout/FilterMenuToggle.jsx';
import ApiService from '../services/api.js';
import { calculateArticleCategories } from '../utils/categoryUtils.js';
import StreakBeginTip from '../components/streak/streakBeginTip.jsx';
import { getStreakCond, swipeRight } from '../services/other.js';
import XpDisplay from '../components/common/XpDisplay.jsx';
import { getNextArticleId } from '../utils/sortingUtils';

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
  const [selectedSort, setSelectedSort] = useState('Auto');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Add a state to control visibility of both menus
  const [showMenus, setShowMenus] = useState(false);

  // Available filter options (removed Popular, Recent, Hot)
  const filterOptions = ['Technology', 'Environment', 'Global Politics', 'Economics', 'Social Issues'];
  const [streakStatus, setStreakStatus] = useState(0);

  // Add this new state to track the current article ID independent of the URL
  const [currentArticleId, setCurrentArticleId] = useState(params.id ? parseInt(params.id, 10) : 1);

  useEffect(() => {
    initTip();
    getStreakCond().then((resp) => { setStreakStatus(resp.id) });
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

    try {
      // First fetch the article data
      const data = await ApiService.getArticle(id);

      // Check if the article matches the current filters
      const matchesFilters = articleMatchesFilter(data.article);

      if (selectedSort !== 'Auto') {
        // Custom sort logic - but still respect filters
        if (data.status === 200) {
          if (!matchesFilters && selectedFilters.length > 0) {
            // If article doesn't match filters, find the next matching one in sort sequence
            visitedIds.add(id);

            // Get next ID in the sort sequence
            const nextIdInSequence = getNextArticleId(selectedSort, id, direction);

            if (nextIdInSequence && !visitedIds.has(nextIdInSequence)) {
              // Try next article in sequence
              await fetchArticle(nextIdInSequence, visitedIds, direction);
              return;
            } else {
              // We've tried all articles in the sequence and none match
              setNoMatchingArticles(true);
              setLoading(false);
              return;
            }
          }

          // Article matches filters or no filters are applied
          setFetchedArticle(data);
          setCurrentArticleId(id);
          setNoMatchingArticles(false);

          // Update URL without causing page reload
          if (window.location.pathname !== `/articles/${id}`) {
            navigate(`/articles/${id}`, { replace: true });
          }

          setLoading(false);
          return;
        }
      } else {
        // Auto sort logic (using DB next/prev) - same filter handling as before
        if (!matchesFilters) {
          // Add current article ID to visited set to prevent infinite loops
          visitedIds.add(id);

          // Get next article from DB
          const nextId = direction === 'forward' ? data.next : data.prev;

          if (nextId && !visitedIds.has(nextId)) {
            await fetchArticle(nextId, visitedIds, direction);
            return;
          } else {
            // No more articles matching filters
            setNoMatchingArticles(true);
            setLoading(false);
            return;
          }
        }

        // Article matches filters
        setMatchingArticleIds(prev => new Set([...prev, data.article.id]));
        setNoMatchingArticles(false);
        setFetchedArticle(data);
        setCurrentArticleId(id);

        // Update URL without causing page reload
        if (window.location.pathname !== `/articles/${id}`) {
          navigate(`/articles/${id}`, { replace: true });
        }
      }
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
    if (isAnimating) return;

    setIsAnimating(true);
    setTimeout(() => {
      if (selectedSort !== 'Auto') {
        // Use custom sort logic with currentArticleId
        const nextId = getNextArticleId(selectedSort, currentArticleId, 'forward');
        if (nextId) {
          fetchArticle(nextId, new Set(), 'forward');
        } else {
          setNoMatchingArticles(true);
        }
      } else {
        // Use existing next ID from API
        const nextId = fetchedArticle.next;
        if (nextId) {
          fetchArticle(nextId, new Set(), 'forward');
        }
      }
      setIsAnimating(false);
    }, 150);
  };

  const goToPrev = () => {
    if (isAnimating || !fetchedArticle?.prev) return;

    setIsAnimating(true);
    setTimeout(() => {
      if (selectedSort !== 'Auto') {
        // Use custom sort logic
        const prevId = getNextArticleId(selectedSort, articleId || fetchedArticle.article.id, 'backward');
        if (prevId) {
          fetchArticle(prevId, new Set(), 'backward');
        } else {
          setNoMatchingArticles(true);
        }
      } else {
        // Use existing prev ID from API
        const prevId = fetchedArticle.prev;
        if (prevId) {
          fetchArticle(prevId, new Set(), 'backward');
        }
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
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-700 mb-2">No More Articles</h2>

          {selectedFilters.length > 0 ? (
            <p className="text-gray-600 mb-4">
              You've reached the end of articles sorted by "{selectedSort}"
              and matching tags: <span className="font-medium">{selectedFilters.join(', ')}</span>.
            </p>
          ) : (
            <p className="text-gray-600 mb-4">
              You've reached the end of articles sorted by "{selectedSort}".
            </p>
          )}

          {selectedFilters.length > 0 && (
            <p className="text-sm text-gray-500 mb-3">
              Note: Articles must match ALL selected filters to be shown.
            </p>
          )}

          <button
            onClick={handleClearFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Reset Filters & Sort
          </button>
        </div>
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

  // Calculate categories for the current article
  const articleCategories = calculateArticleCategories(fetchedArticle.article);

  console.log('Fetched Article:', fetchedArticle);
  console.log('Article Categories:', articleCategories);
  console.log('Selected Filters:', selectedFilters);
  console.log('Selected Sort:', selectedSort);
  console.log('Matching Article IDs:', Array.from(matchingArticleIds));

  return (
    <div {...handlers} className="w-full bg-gray-200 flex flex-col min-h-screen overflow-hidden relative">
      {/* Header */}
      <AppHeader articleId={articleId} />


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
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} fill="none" />
            </svg>
          )}
        </button>
      </div>

      {/* Streak Tip */}
      {isVideoArticle && <StreakBeginTip streakStatus={streakStatus} />}

      {/* Main Content Area */}
      {noMatchingArticles ? (
        <NoMatchingArticles
          selectedSort={selectedSort}
          selectedFilters={selectedFilters}
          onResetFilters={handleClearFilters}
        />
      ) : (
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
            <div className="flex flex-col items-center">
              <ArticlePreview article={fetchedArticle.article} categories={articleCategories} />
            </div>
          )}
        </div>)}

      {/* Tip Box - Positioned absolutely over content */}
      {/* <ArticleTip
        showTip={showTip}
        onClose={handleCloseTip}
        segmentsCount={fetchedArticle.article.segments.length}
        isVideoArticle={isVideoArticle}
        categories={articleCategories}
      /> */}
    </div>
  );
}
