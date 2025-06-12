import { useState, useMemo } from 'react';

export function SourcesContent({ sources }) {
    const [selectedTag, setSelectedTag] = useState('All');

    const availableTags = useMemo(() => {
        const tags = [...new Set(sources.map(source => source.tag))];
        return ['All', ...tags];
    }, [sources]);

    const showFilters = availableTags.length > 2; // More than just 'All' and one tag

    const filteredSources = useMemo(() => {
        if (selectedTag === 'All') return sources;
        return sources.filter(source => source.tag === selectedTag);
    }, [sources, selectedTag]);

    const handleSourceClick = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (<>
        {showFilters && (
            <div className="flex-shrink-0 mb-4">
                <div className="flex flex-wrap gap-2 justify-center">
                    {availableTags.map((tag) => (
                        <TagButton
                            key={tag}
                            tag={tag}
                            isSelected={selectedTag === tag}
                            onClick={() => setSelectedTag(tag)}
                        />
                    ))}
                </div>
            </div>
        )}

        <div className="flex-1 overflow-y-auto">
            <div className="space-y-4 max-w-2xl mx-auto">
                {filteredSources.map((source, index) => (
                    <SourceCard
                        index={index}
                        key={source.id}
                        source={source}
                        onSourceClick={handleSourceClick}
                    />
                ))}
            </div>
        </div>
    </>);
}


function TagButton({ tag, isSelected, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isSelected
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
        >
            {tag}
        </button>
    );
}

function SourceCard({ index, source, onSourceClick }) {
    const { title, outletName, outletDomain, outletShortcode, url, tag } = source;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
                <SourceAvatar outletShortcode={outletShortcode} index={index} />
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-lg">{outletName}</h3>
                    <p className="text-sm text-gray-500 truncate">{outletDomain}</p>
                </div>
                <TagBadge tag={tag} />
            </div>

            <h4 className="text-lg font-medium text-gray-800 mb-4 leading-snug">
                {title}
            </h4>

            <button
                onClick={() => onSourceClick(url)}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            >
                <span>Open Source</span>
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                </svg>
            </button>
        </div>
    );
}


function SourceAvatar({ outletShortcode, index }) {
    const gradients = [
        'bg-gradient-to-br from-red-500 to-pink-600',
        'bg-gradient-to-br from-emerald-500 to-teal-600',
        'bg-gradient-to-br from-blue-500 to-indigo-600',
        'bg-gradient-to-br from-purple-500 to-violet-600',
        'bg-gradient-to-br from-amber-500 to-orange-600',
        'bg-gradient-to-br from-pink-500 to-rose-600',
        'bg-gradient-to-br from-indigo-500 to-purple-600',
        'bg-gradient-to-br from-teal-500 to-cyan-600',
        'bg-gradient-to-br from-orange-500 to-red-600',
        'bg-gradient-to-br from-cyan-500 to-blue-600',
        'bg-gradient-to-br from-violet-500 to-purple-600',
        'bg-gradient-to-br from-rose-500 to-pink-600'
    ];

    const gradientClass = gradients[(index % (gradients.length - 1)) + 1];

    return (
        <div className={`w-12 h-12 rounded-xl ${gradientClass} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md`}>
            {outletShortcode}
        </div>
    );
}

function TagBadge({ tag }) {
    const getTagColor = (tag) => {
        const colorMap = {
            'News Source': 'bg-blue-100 text-blue-800',
            'Primary Source': 'bg-green-100 text-green-800',
            'Publications': 'bg-purple-100 text-purple-800',
            'Research': 'bg-orange-100 text-orange-800',
            'Government': 'bg-gray-100 text-gray-800',
        };
        return colorMap[tag] || 'bg-gray-100 text-gray-800';
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}>
            {tag}
        </span>
    );
}