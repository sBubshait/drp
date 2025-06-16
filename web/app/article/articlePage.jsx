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
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} fill="none"/>
            </svg>
          )}
        </button>
      </div>

      {/* Streak Tip */}
      {isVideoArticle ? (
        <div></div> ) : (
          <div className="flex flex-col items-center">
            <StreakBeginTip streakStatus={streakStatus} />
          </div>
        )}

      {/* Main Content Area */}
      {noMatchingArticles ? (
        <NoMatchingArticles 
          selectedSort={selectedSort}
          selectedFilters={selectedFilters}
          onResetFilters={handleClearFilters}
        />
      ) : (
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
          <div className="flex flex-col items-center">
            <ArticlePreview article={fetchedArticle.article} categories={articleCategories} />
          </div>
        )}
      </div>)}

      {/* Tip Box - Positioned absolutely over content */}
      <ArticleTip
        showTip={showTip}
        onClose={handleCloseTip}
        segmentsCount={fetchedArticle.article.segments.length}
        isVideoArticle={isVideoArticle}
        categories={articleCategories}
      />

      
      {/* Bottom Navigation Bar */}
      <div className="w-full fixed bg-white flex justify-around overflow-hidden relative border-t border-gray-300 shadow-md py-3">
        <button
          onClick={() => navigate('/articles/1')}
          className="flex flex-col items-center text-gray-700 hover:text-blue-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-arrow-down" viewBox="0 0 16 16">
            <path d="M8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5"/>
            <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/>
          </svg>
          <span className="text-xs">Feed</span>
        </button>

        <button
          onClick={() => navigate('/leaderboard')}
          className="flex flex-col items-center text-gray-700 hover:text-blue-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trophy" viewBox="0 0 16 16">
            <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 
            3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 
            13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 
            .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935M3.504 1q.01.775.056 
            1.469c.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 7 10a.5.5 0 0 1 .5.5v2.61a1 1 0 0 1-.757.97l-1.426.356a.5.5 0 0 0-.179.085L4.5 15h7l-.638-.479a.5.5 
            0 0 0-.18-.085l-1.425-.356a1 1 0 0 1-.757-.97V10.5A.5.5 0 0 1 9 10c.516 0 1.706-.52 2.57-2.864.413-1.12.74-2.64.87-4.667q.045-.694.056-1.469z"/>
          </svg>
          <span className="text-xs">Leaderboard</span>
        </button>

        <button
          onClick={() => navigate('/friends')}
          className="flex flex-col items-center text-gray-700 hover:text-blue-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
            <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11
             10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0
              1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 
              13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 
              1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
          </svg>
          <span className="text-xs">Friends</span>
        </button> 
      </div>
    </div>
  );
}
