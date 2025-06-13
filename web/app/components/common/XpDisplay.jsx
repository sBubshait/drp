import { useEffect, useState } from 'react';
import ApiService from '../../services/api';

export default function XpDisplay() {
  const [xp, setXp] = useState(0);

  useEffect(() => {
    // Load XP from localStorage first for immediate display
    const storedXp = localStorage.getItem('userXp');
    if (storedXp) {
      setXp(parseInt(storedXp, 10));
    }

    // Then fetch the latest XP from the server
    const fetchXp = async () => {
      try {
        const xpData = await ApiService.getUserXp();
        console.log('Fetched XP data:', xpData);
        if (xpData && xpData.xp !== undefined) {
          setXp(xpData.xp);
          localStorage.setItem('userXp', xpData.xp.toString());
        }
      } catch (error) {
        console.error('Error fetching user XP:', error);
      }
    };

    fetchXp();
  }, []);

  return (
    <div className="flex items-center gap-1 bg-gray-700 px-3 py-1 rounded-full shadow-sm border border-gray-600">
      <span className="text-gray-200 font-bold">{xp}</span>
      <span className="text-amber-400 text-xl" role="img" aria-label="XP coin">
        🪙
      </span>
    </div>
  );
}