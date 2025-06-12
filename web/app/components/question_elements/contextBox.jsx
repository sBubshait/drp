export default function ContextBox({ text }) {
  return (
    <div className="flex">
      <div className="w-1 bg-gray-800 mr-4 flex-shrink-0"></div>
      <div className="text-gray-700 leading-relaxed text-xl lg:text-2">
        {text}
      </div>
    </div>
  )
}
