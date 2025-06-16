import CategoryTags from './categoryTags.jsx';

// Helper function to format date array from API
const formatDate = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray)) {
        return "Date unavailable";
    }
    
    try {
        const [year, month, day, hour, minute] = dateArray;
        const date = new Date(year, month - 1, day, hour || 0, minute || 0);
        
        // Format the date in a human-readable format
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid date";
    }
};

function ArticlePreview({ article, categories }) {
    // Get formatted date from the article object
    const formattedDate = formatDate(article.dateCreated);
    
    return (
        <div className="text-center space-y-4 max-w-md">
            {/* Category Tags */}
            <CategoryTags categories={categories} />

            {/* Main Headline */}
            <h1 className="text-3xl font-bold text-gray-800 leading-tight">
                {article.content}
            </h1>

            {/* Date - Now using actual date from article */}
            <div className="text-gray-600 text-sm font-medium">
                {formattedDate}
            </div>
        </div>
    );
}

export default ArticlePreview;