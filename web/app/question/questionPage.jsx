
export function QuestionPage() {
  const handleOptionClick = (option) => {
    alert(`Selected option: ${option}`);
  };

  return (
    <div className="min-h-screen w-full bg-gray-200 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 text-center font-semibold text-lg">
        1/1 | Question
      </div>

      {/* Context Section - From Top */}
      <div className="flex-1 p-6">
        <div className="flex">
          <div className="w-1 bg-gray-800 mr-4 flex-shrink-0"></div>
          <div className="text-gray-700 leading-relaxed text-2xl">
            Trump wants to cut all federal grant money to that was supposed to go for scientific and engineering research at Harvard. He called Harvard as "radicalised", "lunatics", and "troublemakers" who don't deserve taxpayer cash. Instead, they can use the "ridiculous" endowments they have.
          </div>
        </div>
      </div>

      {/* Options - At Bottom */}
      <div className="p-6">
        <div className="mb-6">
          <div className="text-3xl font-medium text-gray-800 text-center mb-24">
            What is the main reason Trump gives for cutting Harvard's federal grants?
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => handleOptionClick('A')}
            className="bg-cyan-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-cyan-700 active:bg-cyan-800 transition-colors"
          >
            $5 Billion
          </button>

          <button
            onClick={() => handleOptionClick('B')}
            className="bg-cyan-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-cyan-700 active:bg-cyan-800 transition-colors"
          >
            $15 Billion
          </button>

          <button
            onClick={() => handleOptionClick('C')}
            className="bg-cyan-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-cyan-700 active:bg-cyan-800 transition-colors"
          >
            $35 Billion
          </button>

          <button
            onClick={() => handleOptionClick('D')}
            className="bg-cyan-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-cyan-700 active:bg-cyan-800 transition-colors"
          >
            $53 Billion
          </button>
        </div>
      </div>
    </div>
  );
}