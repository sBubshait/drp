import Flame from "./flame"

export default function StreakBeginTip({className, streakStatus}) {
  return(
    <div className={(streakStatus == 0) ? "hidden" : className}>
      <div className="text-center">
        <Flame className="inline-block px-7 scale-50"/>
        <span className="text-4xl font-bold text-red-600 leading-tight">
            Streak available!
        </span>
      </div>
      <p className="text-xl text-center text-red-600 leading-tight">
          {(streakStatus == 1) ? 
          "Complete this article to start a streak" :
          "Don't lose your streak!"}
      </p>
    </div>)
}
