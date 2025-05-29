export default function ChoicesButtons({options, onSelectOption}) {
  return (
    <div className="flex flex-col space-y-4">
      {options.map((optionText, index) => (
        <button
          key={index}
          onClick={() => onSelectOption(index)}
          className="bg-cyan-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-cyan-700 active:bg-cyan-800 transition-colors"
        >
          {optionText}
        </button>
      ))}
    </div>
  )
}
