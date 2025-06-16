import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import { BottomNav } from '../components/site_layout/BottomNav';

export function LeaderboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || '/articles/1';
  const [users, setUsers] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSortedByXP, setIsSortedByXP] = useState(true);

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
      const response = [
        { userId: 1, name: 'Alice Carter', streak: 3, xp: 89 },
        { userId: 2, name: 'Benjamin Lee', streak: 14, xp: 77 },
        { userId: 3, name: 'Clara Wilson', streak: 8, xp: 93 },
        { userId: 4, name: 'Daniel Kim', streak: 9, xp: 84 },
        { userId: 5, name: 'Eva Thompson', streak: 1, xp: 71 },
        { userId: 6, name: 'Frank Martinez', streak: 17, xp: 95 },
        { userId: 7, name: 'Grace Patel', streak: 1, xp: 68 },
        { userId: 8, name: 'Henry Nguyen', streak: 34, xp: 82 },
        { userId: 9, name: 'Isabella Lopez', streak: 7, xp: 90 },
        { userId: 10, name: 'Jack Morgan', streak: 2, xp: 74 },
      ];

      const withColor = response.map(user => ({ ...user, color: getRandomColor() }));
      setUsers(withColor);
      setSortedUsers([...withColor].sort((a, b) => b.xp - a.xp));
    } catch (err) {
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const sortByXP = () => {
    setIsSortedByXP(true);
    setSortedUsers([...users].sort((a, b) => b.xp - a.xp));
  };

  const sortByStreak = () => {
    setIsSortedByXP(false);
    setSortedUsers([...users].sort((a, b) => b.streak - a.streak));
  };

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
      </div>

      {/* Sort Buttons */}
      <div className="flex justify-center space-x-4 bg-gray-100 py-2 shadow-md z-0">
        <button onClick={sortByXP}
          className={`py-1 px-6 rounded-lg text-lg font-medium transition-colors ${
            isSortedByXP ? 'bg-cyan-700 text-white cursor-not-allowed' : 'bg-cyan-600 text-white hover:bg-cyan-700 active:bg-cyan-800'
          }`}>
          Sort by XP
        </button>
        <button onClick={sortByStreak}
          className={`py-1 px-6 rounded-lg text-lg font-medium transition-colors ${
           (!isSortedByXP) ? 'bg-cyan-700 text-white cursor-not-allowed' : 'bg-cyan-600 text-white hover:bg-cyan-700 active:bg-cyan-800'
          }`}>
          Sort by Streak
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {loading && <p className="text-gray-500">Loading leaderboard...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && sortedUsers.length === 0 && (
          <p className="text-gray-500">No users to display.</p>
        )}

        {sortedUsers.map((user, index) => (
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
              <p className="text-xs text-gray-500">streak: {user.streak} | xp: {user.xp}</p>
            </div>

            <div className="text-cyan-600 font-bold">
              {isSortedByXP 
                ? <div className="text-cyan-600 font-bold"> {user.xp} xp </div>
                : <div className="text-red-600 font-bold"> {user.streak} 🔥 </div>
                }
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
