export default function FeedbackBox({ title, body }) {
  return (
    <div className="absolute bottom-0 left-0 w-full h-1/2 p-4 z-40">
      <div className="bg-gray-800 text-white rounded-2xl p-6 shadow-2xl h-full overflow-y-auto">
        <div className="text-lg font-semibold mb-2 text-teal-300">
          {title}
        </div>
        <div className="text-sm whitespace-pre-line">
          {body}
        </div>
      </div>
    </div>
  );
}
