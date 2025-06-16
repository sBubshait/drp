import { useNavigate } from 'react-router';
import XpDisplay from '../common/XpDisplay.jsx';

export default function AppHeader({ articleId, title = "Politico" }) {
  const navigate = useNavigate();

  return (
    <div className="flex">
      {/* App title - left side */}
      <div className="bg-gray-800 px-6 py-3 text-white font-bold text-6xl flex-1">
        {title}
      </div>
      
      {/* Leaderboard and XP - right side, stacked vertically */}
      <div className="bg-gray-800 px-6 py-3 flex flex-col items-center justify-center gap-2">
        <XpDisplay articleId={articleId} />
      </div>
    </div>
  );
}