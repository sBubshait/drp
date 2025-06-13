import { useEffect, useState } from 'react';
import ApiService from '../../services/api';

export default function XpDisplay({ articleId, segmentId }) {
  const [xp, setXp] = useState(0);

  useEffect(() => {
    // Load XP from localStorage first for immediate display
    const storedXp = localStorage.getItem('userXp');
    if (storedXp) {
      setXp(parseInt(storedXp, 10));
    }

    // Then fetch the latest XP from the server whenever articleId or segmentId changes
    const fetchXp = async () => {
      try {
        const xpData = await ApiService.getUserXp();
        if (xpData && xpData.xp !== undefined) {
          setXp(xpData.xp);
          localStorage.setItem('userXp', xpData.xp.toString());
        }
      } catch (error) {
        console.error('Error fetching user XP:', error);
      }
    };

    fetchXp();
  }, [articleId, segmentId]); // Re-fetch when these values change

  return (
    <div className="bg-gray-700 text-white py-1 px-10 rounded-lg text-sm font-medium">
      <span className="text-gray-200 font-bold">{xp}</span>
      <span className="text-amber-400 text-xl" role="img" aria-label="XP coin">
        🪙
      </span>
    </div>
  );
}