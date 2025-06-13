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

  const fetchLeaderboard = async () => {
    try {
      // const response = await ApiService.getLeaderboard(); // You need to define this API method
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
      const sorted = response.sort((a, b) => b.score - a.score);
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

  return (
    <div {...handlers} className="min-h-screen w-full bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-800 text-white px-4 py-3">
        <h1 className="text-lg font-bold">Leaderboard</h1>
        <button
          onClick={() => navigate(returnTo)}
          className="bg-cyan-600 text-white py-4 px-6 rounded-lg text-lg font-medium"
        >
          ← Back to Feed
        </button>
      </div>


      {/* Content */}
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
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-600 text-white font-bold text-sm">
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
