import Flame from "./flame";
import Odometer from "./odometer";

export function StreakCompletedPage({className = ""}) {
  return(
    <div className="flex-1 flex flex-col justify-center items-center">
      <Flame className="p-8 scale-200"/>

      <Odometer value={0} containerSize={20} digitSize={5}/>

      <span className="text-4xl font-bold text-red-600 leading-tight">
          Streak completed!
      </span>


      <p className="text-xl text-center text-red-600 leading-tight">
        Congratulations :)
      </p>
    </div>
  );
}
