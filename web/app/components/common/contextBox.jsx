export default function ContextBox({ text }) {
  return (
    <div className="h-full flex overflow-hidden">
      <div className="w-1 bg-gray-800 mr-4 flex-shrink-0"></div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="text-gray-700 leading-relaxed text-xl lg:text-2xl">
          {text}
        </div>
      </div>
    </div>
  );
}