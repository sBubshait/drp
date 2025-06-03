export default function ResponseContainer({ response, active = false }) {
    return (
        <div key={response.id} className={`rounded-lg p-6 text-white flex flex-col justify-center ${active ? 'bg-cyan-600' : 'bg-gray-600 '}`}>
            <div className="text-white text-base leading-relaxed mb-4">
                {response.text}
            </div>
            <div className="text-gray-300 text-sm text-right">
                — {response.user}
            </div>
        </div>
    );
}