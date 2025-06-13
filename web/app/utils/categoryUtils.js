export const calculateArticleCategories = (article) => {
  // Define thresholds as constants
  const POPULAR_THRESH = 500;
  const RECENT_THRESH_DAYS = 30; // 1 month in days
  const HOT_THRESH = 100;

  const calculateInteractionsPerDay = (dateCreated, totalInteractions) => {
    const [month, day, year] = dateCreated.split('-').map(Number);
    const createdDate = new Date(year, month - 1, day);
    const currentDate = new Date();
    const timeDifference = currentDate - createdDate;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    if (daysDifference <= 0) return totalInteractions;
    return Math.round(totalInteractions / daysDifference);
  };

  const calculateAgeInDays = (dateCreated) => {
    const [month, day, year] = dateCreated.split('-').map(Number);
    const createdDate = new Date(year, month - 1, day);
    const currentDate = new Date();
    const timeDifference = currentDate - createdDate;
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  };

  // Hardcoded attributes - you might want to get these from the API response in the future
  const hardcodedAttrs = {
    interactions: 2000,
    dateCreated: '01-01-2019',
    get interactionsPerDay() {
      return calculateInteractionsPerDay(this.dateCreated, this.interactions);
    },
    get ageInDays() {
      return calculateAgeInDays(this.dateCreated);
    }
  };

  const categories = [article.category];
  
  // Add conditional tags
  if (hardcodedAttrs.interactions > POPULAR_THRESH) {
    categories.push('Popular');
  }
  if (hardcodedAttrs.ageInDays < RECENT_THRESH_DAYS) {
    categories.push('Recent');
  }
  if (hardcodedAttrs.interactionsPerDay > HOT_THRESH) {
    categories.push('Hot');
  }

  return categories;
};