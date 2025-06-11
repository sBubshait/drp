function ArticlePreview({ article }) {
    return (
            <div className="text-center space-y-4 max-w-md">
                {/* Category Tag */}
                <div>
                    <span className="inline-block px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide text-white" style={{ backgroundColor: '#00ADB5' }}>
                        {article.category}
                    </span>
                </div>

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