export default function WriteSection({ userInput, setUserInput, handleSubmit }) {
    return (
        <div className="bg-white rounded-xl p-5 mb-5 flex-1 flex flex-col">
            <textarea
                className="w-full flex-1 p-4 border-2 border-gray-300 rounded-lg text-base resize-none outline-none focus:border-cyan-600 transition-colors text-gray-700"
                placeholder="Type your response here..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
            />
            <button
                onClick={handleSubmit}
                className="w-full bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white py-4 rounded-lg text-base font-medium mt-4 transition-colors"
            >
                Share
            </button>
        </div>
    )
}