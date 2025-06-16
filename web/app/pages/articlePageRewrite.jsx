import { useEffect, useState, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useNavigate, useLocation } from 'react-router';
import VerticalVideoPlayer from "../components/site_layout/videoPlayer.jsx";
import ArticlePreview from '../components/site_layout/articlePreview.jsx';
import AppHeader from '../components/site_layout/AppHeader.jsx';
import NoMatchingArticles from '../components/site_layout/noMatchingArticles.jsx';
import FilterSection from '../components/site_layout/filterSection.jsx';
import ArticleTip from '../components/site_layout/ArticleTip.jsx';
import ApiService from '../services/api.js';
import { calculateArticleCategories } from '../utils/categoryUtils.js';
import StreakBeginTip from '../components/streak/streakBeginTip.jsx';
import { StreakCompletedPage } from '../components/streak/streakCompletedPage.jsx';
import { getStreakCond, swipeRight } from '../services/other.js';
import { BottomNav } from '../components/site_layout/BottomNav.jsx';

export function ArticlePageRewrite() {
    const navigate = useNavigate();
    const location = useLocation();

    // State for all articles and current index
    const [allArticles, setAllArticles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [filteredArticles, setFilteredArticles] = useState([]);

    // UI state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTip, setShowTip] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [noMatchingArticles, setNoMatchingArticles] = useState(false);

    // Sort by state
    const [selectedSort, setSelectedSort] = useState('Auto');
    const [showSortMenu, setShowSortMenu] = useState(false);

    // Add a state to control visibility of both menus
    const [showMenus, setShowMenus] = useState(false);

    // Enhanced streak state
    const [streakStatus, setStreakStatus] = useState(0);

    // Available filter options
    const filterOptions = ['Technology', 'Environment', 'Global Politics', 'Economics', 'Social Issues'];

    // Initialize tip state and fetch streak condition
    useEffect(() => {
        initTip();
        fetchStreakStatus();
    }, []);

    // Separate function to fetch streak status
    const fetchStreakStatus = async () => {
        try {
            const resp = await getStreakCond();
            setStreakStatus(resp.id);
        } catch (error) {
            console.error("Error fetching streak status:", error);
        }
    };

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

    // Helper function to check if article matches ALL selected filters
    const articleMatchesFilter = (article) => {
        if (selectedFilters.length === 0) return true; // No filters = show all
        
        const categories = calculateArticleCategories(article);
        
        // Normalize categories by trimming whitespace
        const normalizedCategories = categories.map(cat => cat.trim());
        
        // Article must match ALL selected filters
        return selectedFilters.every(filter => 
            normalizedCategories.includes(filter) || 
            normalizedCategories.includes(filter.trim())
        );
    };

    // Fetch all articles on component mount
    useEffect(() => {
        fetchAllArticles();
    }, []);

    // Filter and sort articles when filters or sort method changes
    useEffect(() => {
        if (allArticles.length > 0) {
            // Apply new filters and sorting
            applyFiltersAndSort();

            // Always reset to first article when sort or filters change
            setCurrentIndex(0);
        }
    }, [allArticles, selectedFilters, selectedSort]);

    // Fetch all articles from the API
    const fetchAllArticles = async () => {
        setLoading(true);

        try {
            const response = await ApiService.getAllArticles();

            if (response.status === 200 && response.articles) {
                setAllArticles(response.articles);
                setCurrentIndex(0);
            } else {
                setError('Failed to fetch articles');
            }
        } catch (error) {
            console.error('Error fetching all articles:', error);
            setError(error.message || 'Failed to load articles');
        } finally {
            setLoading(false);
        }
    };

    // Apply filters and sorting to all articles
    const applyFiltersAndSort = () => {
        // First filter articles
        let filtered = allArticles.filter(articleMatchesFilter);

        // Then sort them
        if (selectedSort !== 'Auto') {
            filtered = sortArticles(filtered, selectedSort);
        }

        // Update filtered articles
        setFilteredArticles(filtered);

        // Reset current index when filters or sort changes
        setCurrentIndex(0);

        // If no articles match, show the no matches screen
        if (filtered.length === 0) {
            setNoMatchingArticles(true);
        } else {
            setNoMatchingArticles(false);
        }
    };

    // Add the parseApiDate function to handle array format dates from the API
    const parseApiDate = (dateArray) => {
        if (!dateArray || !Array.isArray(dateArray)) return new Date(0);

        // API format: [year, month, day, hour, minute, second, microsecond]
        // Note: JavaScript months are 0-indexed (0=January, 11=December)
        const [year, month, day, hour, minute, second] = dateArray;
        return new Date(year, month - 1, day, hour || 0, minute || 0, second || 0);
    };

    // Update sort functions to use parseApiDate and totalInteractions
    const sortArticles = (articles, sortType) => {
        switch (sortType) {
            case 'Popular':
                return [...articles].sort((a, b) =>
                    (b.totalInteractions || 0) - (a.totalInteractions || 0)
                );

            case 'Recent':
                return [...articles].sort((a, b) => {
                    const dateA = parseApiDate(a.dateCreated);
                    const dateB = parseApiDate(b.dateCreated);
                    return dateB - dateA; // Most recent first
                });

            case 'Hot':
                return [...articles].sort((a, b) => {
                    const aInteractionsPerDay = calculateInteractionsPerDay(a.dateCreated, a.totalInteractions || 0);
                    const bInteractionsPerDay = calculateInteractionsPerDay(b.dateCreated, b.totalInteractions || 0);
                    return bInteractionsPerDay - aInteractionsPerDay;
                });

            default:
                return articles;
        }
    };

    const calculateInteractionsPerDay = (dateCreated, totalInteractions) => {
        if (!dateCreated) return 0;

        const createdDate = parseApiDate(dateCreated);
        const currentDate = new Date();
        const timeDifference = currentDate - createdDate;
        const daysDifference = Math.max(1, Math.ceil(timeDifference / (1000 * 60 * 60 * 24)));

        return Math.round(totalInteractions / daysDifference);
    };

    // Modified handleSortChange function to reset current index and apply animation
    const handleSortChange = (sortOption) => {
        // Only proceed if there's an actual change
        if (sortOption !== selectedSort) {
            // Show animation to indicate change
            setIsAnimating(true);

            // Set the new sort option
            setSelectedSort(sortOption);

            // Reset to the first article in the new sorted list
            setCurrentIndex(0);

            // End animation after a short delay
            setTimeout(() => {
                setIsAnimating(false);
            }, 300);
        }
    };

    // Update handleFilterToggle to prevent double filter application
    const handleFilterToggle = (filter) => {
        setSelectedFilters(prev => {
            // Create the new filters array
            const newFilters = prev.includes(filter)
                ? prev.filter(f => f !== filter) // Remove if already selected
                : [...prev, filter]; // Add if not selected
            
            return newFilters;
        });
        
        // Don't close the filter menu when selecting a filter
        // This allows users to select multiple filters
    };

    // Update handleClearFilters to only clear filters without changing sort
    const handleClearFilters = () => {
        setSelectedFilters([]);
        // Don't reset sort unless explicitly requested
        // setSelectedSort('Auto'); <- Remove this line
        setShowFilterMenu(false);
    };

    // Add a separate function to reset everything
    const handleResetAll = () => {
        setSelectedFilters([]);
        setSelectedSort('Auto');
        setShowFilterMenu(false);
    };

    // Navigation functions with animation
    const goToNext = () => {
        if (isAnimating || filteredArticles.length === 0) return;

        if (currentIndex < filteredArticles.length - 1) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
                setIsAnimating(false);
            }, 150);
        }
    };

    const goToPrev = () => {
        if (isAnimating || filteredArticles.length === 0) return;

        if (currentIndex > 0) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex(currentIndex - 1);
                setIsAnimating(false);
            }, 150);
        }
    };

    // Navigation function for swipe to questions
    const goToQuestions = () => {
        if (isAnimating || filteredArticles.length === 0) return;

        const currentArticle = filteredArticles[currentIndex];
        if (!currentArticle) return;

        swipeRight(currentArticle.id);

        // Pass complete context for returning to the correct article
        navigate(`/articles/${currentArticle.id}/questions`, {
            state: {
                segments: currentArticle.segments,
                nextArticleId: currentIndex < filteredArticles.length - 1 ? filteredArticles[currentIndex + 1].id : null,
                nextArticleIndex: currentIndex < filteredArticles.length - 1 ? currentIndex + 1 : null,
                articleId: currentArticle.id,
                articleTitle: currentArticle.content,
                initStreak: streakStatus > 0,
                originalArticleIndex: currentIndex,
                // Add sort information
                currentSort: selectedSort,
                currentFilters: selectedFilters
            }
        });
    };

    // Format filter display text
    const getFilterDisplayText = () => {
        if (selectedFilters.length === 0) return 'All';
        if (selectedFilters.length === 1) return selectedFilters[0];
        return `${selectedFilters.length} filters`;
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

    // Add this effect to handle incoming navigation with a target article
    useEffect(() => {
        // Check if we're coming from questions page with a target article
        if (location.state?.targetArticleId && filteredArticles.length > 0) {
            // First, restore sort settings if they were provided
            if (location.state.currentSort && location.state.currentSort !== selectedSort) {
                setSelectedSort(location.state.currentSort);

                // If filters were also saved, restore them
                if (location.state.currentFilters) {
                    setSelectedFilters(location.state.currentFilters);
                }

                // This will trigger a re-filter and re-sort through the useEffect
                // We'll return early and let the next effect cycle handle finding the article
                return;
            }

            // Always prioritize finding by ID first
            const targetIndex = filteredArticles.findIndex(
                article => String(article.id) === String(location.state.targetArticleId)
            );

            if (targetIndex !== -1) {
                // Found by ID, use this index
                setCurrentIndex(targetIndex);
            } else if (location.state.targetArticleIndex !== undefined &&
                location.state.targetArticleIndex < filteredArticles.length) {
                // Fallback to index-based lookup only if ID lookup fails
                setCurrentIndex(location.state.targetArticleIndex);
            }
        }
    }, [filteredArticles, location.state, selectedSort]);

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
                <p className="text-red-600 font-semibold">Error loading articles</p>
                <p className="text-gray-500 text-sm mt-2">{error}</p>
                <button
                    onClick={fetchAllArticles}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (noMatchingArticles) {
        return (
            <div className="w-full bg-gray-200 flex flex-col min-h-screen overflow-hidden relative">
                <AppHeader />
                
                {/* Filter Section */}
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
                                onSortChange={handleSortChange}
                            />
                        )}
                    </div>
                    
                    {/* Toggle Menus Button */}
                    <button
                        onClick={() => setShowMenus((prev) => !prev)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xl flex items-center justify-center"
                        aria-label={showMenus ? 'Hide Filters & Sort' : 'Show Filters & Sort'}
                    >
                        {showMenus ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7.5a11.72 11.72 0 012.91-4.36M6.53 6.53A9.98 9.98 0 0112 5c5 0 9.27 3.11 11 7.5a11.72 11.72 0 01-4.17 5.19M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1.458 12C2.732 7.943 6.523 5 12 5c5.477 0 9.268 2.943 10.542 7-1.274 4.057-5.065 7-10.542 7-5.477 0-9.268-2.943-10.542-7z" />
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} fill="none" />
                        </svg>
                        )}
                    </button>
                </div>
                
                {/* Use the simplified NoMatchingArticles component */}
                <NoMatchingArticles
                    selectedSort={selectedSort}
                    selectedFilters={selectedFilters}
                    onResetFilters={handleResetAll} // Use the full reset function here
                />
                
                <BottomNav />
            </div>
        );
    }

    if (filteredArticles.length === 0) {
        return (
            <div className="w-full bg-gray-200 flex flex-col min-h-screen items-center justify-center">
                <p className="text-gray-600">No articles available</p>
            </div>
        );
    }

    const currentArticle = filteredArticles[currentIndex];
    const isVideoArticle = currentArticle.type === 'video';

    // Calculate categories for the current article
    const articleCategories = calculateArticleCategories(currentArticle);

    return (
        <div {...handlers} className="w-full bg-gray-200 flex flex-col min-h-screen overflow-hidden relative">
            {/* Header */}
            <AppHeader articleId={currentArticle?.id} />

            <div className="relative">
                <StreakBeginTip streakStatus={streakStatus} />
            </div>

            {/* Filters and toggle button row - only show if not in streak completed state */}
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
                            onSortChange={handleSortChange}
                        />
                    )}
                </div>

                <button
                    onClick={() => setShowMenus((prev) => !prev)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xl flex items-center justify-center"
                    aria-label={showMenus ? 'Hide Filters & Sort' : 'Show Filters & Sort'}
                >
                    {showMenus ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7.5a11.72 11.72 0 012.91-4.36M6.53 6.53A9.98 9.98 0 0112 5c5 0 9.27 3.11 11 7.5a11.72 11.72 0 01-4.17 5.19M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1.458 12C2.732 7.943 6.523 5 12 5c5.477 0 9.268 2.943 10.542 7-1.274 4.057-5.065 7-10.542 7-5.477 0-9.268-2.943-10.542-7z" />
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} fill="none" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Regular article content */}
            <div className={`flex-1 flex flex-col justify-center items-center relative transition-all duration-300 ease-out ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                }`}>
                {isVideoArticle ? (
                    /* Video Article Layout - Full Screen */
                    <div className="w-full h-full relative">
                        {/* Video Player - Takes full available space */}
                        <div className="w-full h-full p-4">
                            <VerticalVideoPlayer
                                videoUrl={currentArticle.content}
                                categories={articleCategories}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <ArticlePreview article={currentArticle} categories={articleCategories} />
                    </div>
                )}
            </div>

            {/* Always show bottom nav */}
            <BottomNav />
        </div>
    );
}