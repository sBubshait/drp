import Flame from "./flame"

export default function StreakBeginTip({ className, streakStatus }) {
  if (streakStatus == 0) return null;

  return (
    <div className="absolute top-36 left-6 right-6 z-20">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl shadow-lg p-4 backdrop-blur-sm bg-opacity-95">
        <div className="flex items-center gap-4">
          {/* Flame container */}
          <div className="flex-shrink-0 w-12 h-12 flex justify-center items-center">
            <Flame className="scale-75" />
          </div>

          {/* Text container */}
          <div className="flex-1">
            <p className="text-lg text-red-700 font-bold leading-tight">
              {streakStatus === 1
                ? "Ready to start your streak? Complete an article today!"
                : "Keep your streak alive! Don't miss today's article."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


