import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import { BottomNav } from '../components/site_layout/BottomNav';
import ApiService from '../services/api';

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

  // Helper function to get initials from user tag
  const getInitials = (tag) => {
    if (!tag) return '??';
    
    // Find all capital letters in the tag
    const capitals = tag.match(/[A-Z]/g) || [];
    
    if (capitals.length >= 2) {
      // If there are at least 2 capitals, use the first two
      return capitals.slice(0, 2).join('');
    } else if (capitals.length === 1) {
      // If there's only 1 capital, use it and the next letter
      const capitalIndex = tag.indexOf(capitals[0]);
      const nextIndex = capitalIndex + 1;
      
      if (nextIndex < tag.length) {
        return capitals[0] + tag[nextIndex].toUpperCase();
      } else {
        // If capital is the last letter, use the first letter as well
        return tag[0].toUpperCase() + capitals[0];
      }
    } else {
      // If no capitals, use first two letters capitalized
      return tag.slice(0, 2).toUpperCase();
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getAllUsers();
      
      if (response.status === 200 && response.users) {
        // Add a random color to each user
        const withColor = response.users.map(user => ({ 
          ...user, 
          color: getRandomColor() 
        }));
        setUsers(withColor);
        
        // Initial sort based on current sort setting
        sortUsers(withColor);
      } else {
        setError('Failed to load users data');
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to sort users and take top 10
  const sortUsers = (userList) => {
    const sorted = [...userList].sort((a, b) => 
      isSortedByXP ? b.xp - a.xp : b.streak - a.streak
    );
    // Take only the top 10 users
    setSortedUsers(sorted.slice(0, 10));
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Re-sort when the sort option changes
  useEffect(() => {
    if (users.length > 0) {
      sortUsers(users);
    }
  }, [isSortedByXP]);

  const sortByXP = () => {
    if (!isSortedByXP) {
      setIsSortedByXP(true);
    }
  };

  const sortByStreak = () => {
    if (isSortedByXP) {
      setIsSortedByXP(false);
    }
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
              {getInitials(user.tag)}
            </div>

            <div className="ml-4 flex-1">
              <p className="font-semibold text-gray-800">{user.tag}</p>
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
