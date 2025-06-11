import CategoryTags from './categoryTags.jsx';

function ArticlePreview({ article, categories }) {
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