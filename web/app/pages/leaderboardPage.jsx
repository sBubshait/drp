import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import { BottomNav } from '../components/site_layout/BottomNav';
import ApiService from '../services/api';
import AppHeader from '../components/site_layout/AppHeader';
import { getUserId } from '../services/userApi';

export function LeaderboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || '/articles/1';
  const [users, setUsers] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSortedByXP, setIsSortedByXP] = useState(true);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFriendsOnly, setShowFriendsOnly] = useState(false);

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
      
      let userData = [];
      
      if (showFriendsOnly) {
        // Get user ID and fetch friends data
        const userId = await getUserId();
        const response = await ApiService.getFriends(userId);
        
        if (response.status === 200) {
          // Use only accepted friends
          userData = response.friends || [];
        } else {
          setError('Failed to load friends data');
          return;
        }
      } else {
        // Fetch all users
        const response = await ApiService.getAllUsers();
        
        if (response.status === 200 && response.users) {
          userData = response.users;
        } else {
          setError('Failed to load users data');
          return;
        }
      }
      
      // Add random colors to users
      const withColor = userData.map(user => ({ 
        ...user, 
        color: getRandomColor() 
      }));
      
      setUsers(withColor);
      
      // Sort users based on current sort setting
      sortUsers(withColor);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(`Failed to load ${showFriendsOnly ? 'friends' : 'leaderboard'}`);
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

  // Re-fetch when toggle changes between friends/everyone
  useEffect(() => {
    fetchLeaderboard();
  }, [showFriendsOnly]);

  // Re-sort when the sort option changes
  useEffect(() => {
    if (users.length > 0) {
      sortUsers(users);
    }
  }, [isSortedByXP]);

  const handleSortChange = (byXP) => {
    if (byXP !== isSortedByXP) {
      setIsSortedByXP(byXP);
    }
    setShowSortDropdown(false);
  };

  const handleToggleChange = () => {
    setShowFriendsOnly(prev => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showSortDropdown) {
        setShowSortDropdown(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showSortDropdown]);

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
      <AppHeader title="Leaderboard" />

      {/* Sort Dropdown and Toggle Switch Row */}
      <div className="px-4 py-2 bg-gray-100 shadow-md z-10 flex justify-between items-center">
        {/* Sort Dropdown - Left Aligned */}
        <div className="relative inline-block text-left">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSortDropdown(!showSortDropdown);
            }}
            className="bg-cyan-700 hover:bg-cyan-600 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2"
          >
            <span>Sort by: {isSortedByXP ? 'XP' : 'Streak'}</span>
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 9l-7 7-7-7" 
              />
            </svg>
          </button>
          
          {showSortDropdown && (
            <div 
              className="absolute left-0 mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="py-1">
                <button
                  onClick={() => handleSortChange(true)}
                  className={`${
                    isSortedByXP ? 'bg-cyan-50 text-cyan-700 font-medium' : 'text-gray-700'
                  } block px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
                >
                  Sort by XP
                </button>
                <button
                  onClick={() => handleSortChange(false)}
                  className={`${
                    !isSortedByXP ? 'bg-cyan-50 text-cyan-700 font-medium' : 'text-gray-700'
                  } block px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
                >
                  Sort by Streak
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Toggle Switch - Right Aligned */}
        <div className="flex items-center">
          <span className={`mr-2 text-sm ${!showFriendsOnly ? 'font-medium text-cyan-700' : 'text-gray-600'}`}>
            Everyone
          </span>
          
          <div 
            onClick={handleToggleChange}
            className="relative inline-block w-12 h-6 cursor-pointer"
          >
            <div className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${showFriendsOnly ? 'bg-cyan-600' : 'bg-gray-400'}`}>
              <div 
                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow transition-transform duration-200 ease-in-out ${showFriendsOnly ? 'transform translate-x-6' : ''}`}
              ></div>
            </div>
          </div>
          
          <span className={`ml-2 text-sm ${showFriendsOnly ? 'font-medium text-cyan-700' : 'text-gray-600'}`}>
            Friends
          </span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {loading && <p className="text-gray-500">Loading leaderboard...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && sortedUsers.length === 0 && (
          <p className="text-gray-500">
            {showFriendsOnly 
              ? "No friends to display. Add some friends to see them on the leaderboard!" 
              : "No users to display."}
          </p>
        )}

        {sortedUsers.map((user, index) => (
          <div
            key={user.id || user.userId}
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
