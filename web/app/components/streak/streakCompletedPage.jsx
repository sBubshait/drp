import Flame from "./flame";
import Odometer from "./odometer";

export function StreakCompletedPage({streakNo}) {

  return(!(streakNo === null) ?
    <div className="flex-1 flex flex-col justify-center items-center">
      <Flame className="p-8 scale-200"/>

      <Odometer value={streakNo} containerSize={20} digitSize={5}/>

      <span className="text-4xl font-bold text-red-600 leading-tight">
          Streak completed!
      </span>

    </div>
    : <p> Loading... </p>
  );
}
