import ChoicesButtons from "./choicesButtons.jsx";

export default function MultipleChoiceQuestion({
  questionText,
  options,
  onSelectOption,
}) {

  return (
    <div className="p-6">
      <div className="text-2xl font-medium text-gray-800 text-center mb-24">
        {questionText}
      </div>

      <ChoicesButtons options={options} onSelectOption={onSelectOption} />

    </div>
  );
}
