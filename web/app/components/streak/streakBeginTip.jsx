import Flame from "./flame"

export default function StreakBeginTip({ className, streakStatus }) {
  if (streakStatus == 0) return null;

  return (
    <div className={className}>
      <div className="flex items-end mb-4">
        {/* Flame fixed width/height container, aligned bottom */}
        <div className="flex-shrink-0 w-14 h-14 flex justify-center items-end">
          <Flame className="scale-60 mb-2" />
        </div>

        {/* Text container flex-grow, stacked vertically */}
        <div className="flex flex-col">
          <p className="text-2xl text-red-600 font-bold leading-tight">
            {streakStatus === 1
              ? <p> Ready to start your streak? <br /> Complete an article today! </p>
              : <p> Keep your streak alive! <br /> Don't miss today's article. </p>
            }
          </p>
        </div>
      </div>
    </div>
  );
}


