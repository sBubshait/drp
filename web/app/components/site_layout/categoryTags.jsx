function CategoryTags({ categories }) {
    return (
        <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category, index) => (
                <span 
                    key={index}
                    className="inline-block px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide text-white" 
                    style={{ backgroundColor: '#00ADB5' }}
                >
                    {category}
                </span>
            ))}
        </div>
    );
}

export default CategoryTags;