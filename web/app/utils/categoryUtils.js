export const calculateArticleCategories = (article) => {
  if (!article) return [];
  
  // Constants for categorization
  const POPULAR_THRESH = 1500;
  const RECENT_THRESH_DAYS = 7;
  const HOT_THRESH = 75;
  
  // Function to calculate date difference in days
  const calculateDaysSince = (dateCreated) => {
    if (!dateCreated) return 999; // Default to old if no date
    
    // Handle array-formatted dates from API
    let createdDate;
    if (Array.isArray(dateCreated)) {
      // Format: [year, month, day, hour, minute, second, microsecond]
      // Note: JavaScript months are 0-indexed (0=January, 11=December)
      const [year, month, day, hour, minute, second] = dateCreated;
      createdDate = new Date(year, month - 1, day, hour || 0, minute || 0, second || 0);
    } else {
      // Handle string dates
      createdDate = new Date(dateCreated);
    }
    
    const currentDate = new Date();
    const timeDifference = currentDate - createdDate;
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  };

  // Get the base category and trim any whitespace
  const categories = article.category ? [article.category.trim()] : [];
  
  // Add conditional tags based on popularity, recency, and interaction rate
  if (article.totalInteractions > POPULAR_THRESH) {
    categories.push('Popular');
  }
  
  const daysSinceCreated = calculateDaysSince(article.dateCreated);
  if (daysSinceCreated < RECENT_THRESH_DAYS) {
    categories.push('Recent');
  }
  
  // Calculate interactions per day for "Hot" tag
  if (article.totalInteractions && article.dateCreated) {
    const interactionsPerDay = article.totalInteractions / Math.max(1, daysSinceCreated);
    if (interactionsPerDay > HOT_THRESH) {
      categories.push('Hot');
    }
  }

  return categories;
};