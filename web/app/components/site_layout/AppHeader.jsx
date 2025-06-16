import { useNavigate } from 'react-router';
import XpDisplay from '../common/XpDisplay.jsx';

export default function AppHeader({ articleId, title = "Politico" }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center bg-gray-800 px-6 py-4 shadow-md">
      {/* Left: Title */}
      <div className="text-white font-extrabold text-4xl tracking-tight">
        {title}
      </div>

      {/* Right: XP display */}
      <div className="flex items-center space-x-3">
        <XpDisplay articleId={articleId} />
      </div>
    </div>
  );
}