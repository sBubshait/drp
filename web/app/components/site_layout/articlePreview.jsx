import CategoryTags from './categoryTags.jsx';

function ArticlePreview({ article }) {
    // Define thresholds as constants
    const POPULAR_THRESH = 500;
    const RECENT_THRESH_DAYS = 30; // 1 month in days
    const HOT_THRESH = 100;

    const calculateInteractionsPerDay = (dateCreated, totalInteractions) => {
        // Parse the date string (MM-DD-YYYY format)
        const [month, day, year] = dateCreated.split('-').map(Number);
        const createdDate = new Date(year, month - 1, day); // month is 0-indexed in Date constructor
        
        // Get current date
        const currentDate = new Date();
        
        // Calculate difference in milliseconds
        const timeDifference = currentDate - createdDate;
        
        // Convert milliseconds to days
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        
        // Avoid division by zero
        if (daysDifference <= 0) return totalInteractions;
        
        // Calculate interactions per day
        return Math.round(totalInteractions / daysDifference);
    };

    const calculateAgeInDays = (dateCreated) => {
        const [month, day, year] = dateCreated.split('-').map(Number);
        const createdDate = new Date(year, month - 1, day);
        const currentDate = new Date();
        const timeDifference = currentDate - createdDate;
        return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    };

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

    // Build categories array with conditional tags
    const buildCategories = () => {
        const baseCategories = [article.category];
        const conditionalTags = [];

        // Add "Popular" tag if interactions > 500
        if (hardcodedAttrs.interactions > POPULAR_THRESH) {
            conditionalTags.push('Popular');
        }

        // Add "Recent" tag if age < 1 month
        if (hardcodedAttrs.ageInDays < RECENT_THRESH_DAYS) {
            conditionalTags.push('Recent');
        }

        // Add "Hot" tag if interactions per day > 100
        if (hardcodedAttrs.interactionsPerDay > HOT_THRESH) {
            conditionalTags.push('Hot');
        }

        return [...baseCategories, ...conditionalTags];
    };

    const categories = buildCategories();
    
    return (
        <div className="text-center space-y-4 max-w-md">
            {/* Category Tags */}
            <CategoryTags categories={categories} />

            {/* Main Headline */}
            <h1 className="text-3xl font-bold text-gray-800 leading-tight">
                {article.content}
            </h1>

            {/* Date */}
            <div className="text-gray-600 text-sm font-medium">
                Today at 12:00 PM
            </div>
        </div>
    );
}

export default ArticlePreview;