import Flame from "./flame"

export default function StreakBeginTip({className}) {
  return(
    <div className={className}>
      <div className="text-center">
        <Flame className="inline-block px-7 scale-50"/>
        <span className="text-4xl font-bold text-red-600 leading-tight">
            Streak available!
        </span>
      </div>
      <p className="text-xl text-center text-red-600 leading-tight">
          Complete this article to earn bonus XP and start a streak
      </p>
    </div>)
}
