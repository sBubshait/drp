import { useEffect, useState } from 'react';
import ApiService from '../../services/api';

const CoinIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    className="inline-block ml-2"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      fill="url(#goldGradient)"
      stroke="#B45309"
      strokeWidth="1"
    />
    <circle
      cx="12"
      cy="12"
      r="7"
      fill="none"
      stroke="#F59E0B"
      strokeWidth="0.5"
      opacity="0.7"
    />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fill="#92400E"
      fontSize="8"
      fontWeight="bold"
    >
      XP
    </text>
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
  </svg>
);

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
    <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white py-2 px-4 rounded-xl shadow-lg border border-gray-500 hover:shadow-xl transition-all duration-200 hover:scale-105">
      <div className="flex items-center justify-between">
        <CoinIcon />
        <span className="text-2xl font-bold text-amber-100 ml-4">
          {xp.toLocaleString()}
        </span>
      </div>
    </div>
  );
}