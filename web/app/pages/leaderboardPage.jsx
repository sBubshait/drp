import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import ApiService from '../services/api';

export function LeaderboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || '/articles/1';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getRandomColor = () => {
    const colors = [
      'bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
      'bg-teal-500', 'bg-emerald-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const fetchLeaderboard = async () => {
    try {
      // const response = await ApiService.getLeaderboard();
      const response = [
        { userId: 1, name: 'Alice Carter', score: 89 },
        { userId: 2, name: 'Benjamin Lee', score: 77 },
        { userId: 3, name: 'Clara Wilson', score: 93 },
        { userId: 4, name: 'Daniel Kim', score: 84 },
        { userId: 5, name: 'Eva Thompson', score: 71 },
        { userId: 6, name: 'Frank Martinez', score: 95 },
        { userId: 7, name: 'Grace Patel', score: 68 },
        { userId: 8, name: 'Henry Nguyen', score: 82 },
        { userId: 9, name: 'Isabella Lopez', score: 90 },
        { userId: 10, name: 'Jack Morgan', score: 74 },
      ];
      const sorted = response
        .sort((a, b) => b.score - a.score)
        .map(user => ({ ...user, color: getRandomColor() }));
      setUsers(sorted);
    } catch (err) {
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handlers = useSwipeable({
    onSwipedDown: () => window.scrollBy(0, -200),
    onSwipedUp: () => window.scrollBy(0, 200),
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  const getRankIcon = (position) => {
    switch (position) {
      case 0:
        return '🏆';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `${position + 1}.`;
    }
  };

  return (
    <div {...handlers} className="h-screen w-full bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-800 text-white px-4 py-3 sticky top-0 z-10 h-20">
        <h1 className="text-lg font-bold">Leaderboard</h1>
        <button
          onClick={() => navigate(returnTo)}
          className="bg-gray-700 text-white py-2 px-6 rounded-lg text-lg font-medium hover:bg-grey-800 active:bg-grey-900 transition-colors">
          ← Back to Feed
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {loading && <p className="text-gray-500">Loading leaderboard...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && users.length === 0 && (
          <p className="text-gray-500">No users to display.</p>
        )}

        {users.map((user, index) => (
          <div
            key={user.userId}
            className="flex items-center bg-white shadow-md rounded-lg p-3 mb-2"
          >
            <div className="w-8 text-center text-lg font-semibold text-gray-700 mr-3">
              {getRankIcon(index)}
            </div>

            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${user.color} text-white font-bold text-sm`}>
              {user.name?.charAt(0).toUpperCase() || '?'}
            </div>

            <div className="ml-4 flex-1">
              <p className="font-semibold text-gray-800">{user.name}</p>
            </div>

            <div className="text-cyan-600 font-bold">{user.score} xp</div>
          </div>
        ))}
      </div>
    </div>
  );
}
