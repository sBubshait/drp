export default function ResponseContainer({ content, user, active = false }) {
    return (
        <div className={`rounded-lg p-6 text-white flex flex-col justify-center ${active ? 'bg-cyan-600' : 'bg-gray-600 '}`}>
            <div className="text-white text-base leading-relaxed mb-4">
                {content}
            </div>
            <div className="text-gray-300 text-sm text-right">
                — {user}
            </div>
        </div>
    );
}