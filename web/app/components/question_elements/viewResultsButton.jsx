export default function ViewResultsButton({ resultsClickHandler }) {
  return (
    <button
      onClick={resultsClickHandler}
      className={`
          w-1/2
          px-6
          py-4
          bg-gray-700
          hover:bg-gray-600
          active:bg-gray-800
          disabled:bg-gray-400
          disabled:cursor-not-allowed
          text-white
          font-medium
          text-base
          rounded-lg
          transition-colors
          duration-200
          focus:outline-none
          focus:ring-2
          focus:ring-gray-500
          focus:ring-offset-2
        `}
    >
      View Results
    </button>
  );
}
