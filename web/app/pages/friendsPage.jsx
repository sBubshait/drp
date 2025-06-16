import React, { useState, useEffect, useRef, useCallback } from 'react';
import AppHeader from "../components/site_layout/AppHeader";
import UserSearchBar from "../components/friends/UserSearchBar";
import PendingRequestsSection from "../components/friends/PendingRequestsSection";
import MyFriendsSection from "../components/friends/MyFriendsSection";
import AllUsersSection from "../components/friends/AllUsersSection";
import ApiService from "../services/api";
import { getUserId } from "../services/userApi";
import UserTagDisplay from '../components/friends/UserTagDisplay';
import { BottomNav } from '../components/site_layout/BottomNav';

export function FriendsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    
    // Ref to store the polling interval
    const pollingIntervalRef = useRef(null);

    // More efficient object-based comparison using Maps
    const usersAreEqual = useCallback((users1, users2) => {
        if (users1.length !== users2.length) return false;
        
        // Create maps of users by ID with XP and streak info
        const createUserMap = (users) => {
            const map = new Map();
            for (const user of users) {
                const id = user.id || user.userId;
                const xp = user.xp || user.userXp || 0;
                const streak = user.streak || user.userStreak || 0;
                map.set(id, `${xp}:${streak}`);
            }
            return map;
        };
        
        const map1 = createUserMap(users1);
        const map2 = createUserMap(users2);
        
        // Compare maps
        if (map1.size !== map2.size) return false;
        
        for (const [id, value] of map1) {
            if (!map2.has(id) || map2.get(id) !== value) return false;
        }
        
        return true;
    }, []);

    // Fetch initial data
    useEffect(() => {
        async function fetchInitialData() {
            try {
                setLoading(true);
                setError(null);
                
                const userId = await getUserId();
                setCurrentUserId(userId);
                
                // Fetch friends and requests
                const friendsResponse = await ApiService.getFriends(userId);
                
                // Fetch all users at the same time
                const usersResponse = await ApiService.getAllUsers();
                
                if (friendsResponse.status === 200) {
                    setFriends(friendsResponse.friends || []);
                    setPendingRequests(friendsResponse.requests || []);
                } else {
                    setError(friendsResponse.message || 'Failed to load friends');
                }
                
                if (usersResponse.status === 200) {
                    setAllUsers(usersResponse.users || []);
                }
            } catch (err) {
                console.error('Error fetching initial data:', err);
                setError('Error loading data. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchInitialData();
    }, []);
    
    // Polling function to fetch and update data
    const pollFriendsData = useCallback(async () => {
        try {
            const userId = await getUserId();
            
            // Fetch updated friends data
            const friendsResponse = await ApiService.getFriends(userId);
            
            if (friendsResponse.status === 200) {
                // Update friends if list changed or any XP/streak changed
                const newFriends = friendsResponse.friends || [];
                if (!usersAreEqual(friends, newFriends)) {
                    setFriends(newFriends);
                }
                
                // Update pending requests if list changed or any XP/streak changed
                const newRequests = friendsResponse.requests || [];
                if (!usersAreEqual(pendingRequests, newRequests)) {
                    setPendingRequests(newRequests);
                }
            }
            
            // Fetch updated users list
            const usersResponse = await ApiService.getAllUsers();
            if (usersResponse.status === 200) {
                const newUsers = usersResponse.users || [];
                if (!usersAreEqual(allUsers, newUsers)) {
                    setAllUsers(newUsers);
                }
            }
        } catch (err) {
            // Silent error handling for polling - don't show errors to user
            console.error('Error polling friends data:', err);
        }
    }, [friends, pendingRequests, allUsers, usersAreEqual]);
    
    // Start polling when component mounts
    useEffect(() => {
        // Start polling every 250ms
        pollingIntervalRef.current = setInterval(pollFriendsData, 250);
        
        // Cleanup on unmount
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        };
    }, [pollFriendsData]);

    // Regular data fetching function for explicit refresh
    const fetchFriendsData = async () => {
        try {
            const userId = await getUserId();
            const response = await ApiService.getFriends(userId);
            
            if (response.status === 200) {
                setFriends(response.friends || []);
                setPendingRequests(response.requests || []);
            }
        } catch (err) {
            console.error('Error refreshing friends data:', err);
            // Display the error message from the API response
            alert(`Failed to refresh friends data: ${err.message}`);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleAddFriend = async (friendTag) => {
        try {
            const userId = await getUserId();
            const response = await ApiService.addFriend(userId, friendTag);
            
            if (response.status === 200) {
                console.log('Friend request sent successfully');
                
                // Force an immediate refresh
                fetchFriendsData();
            }
        } catch (err) {
            console.error('Error sending friend request:', err);
            // Display the error message from the API response
            alert(`Failed to send friend request: ${err.message}`);
        }
    };

    const handleAcceptRequest = async (requesterId) => {
        try {
            const userId = await getUserId();
            const response = await ApiService.respondToFriend(userId, requesterId, 'accept');
            
            if (response.status === 200) {
                // UI will update automatically through polling
                console.log('Friend request accepted successfully');
            }
        } catch (err) {
            console.error('Error accepting friend request:', err);
            // Display the error message from the API response
            alert(`Failed to accept friend request: ${err.message}`);
        }
    };

    const handleRejectRequest = async (requesterId) => {
        try {
            const userId = await getUserId();
            const response = await ApiService.respondToFriend(userId, requesterId, 'ignore');
            
            if (response.status === 200) {
                // UI will update automatically through polling
                console.log('Friend request rejected successfully');
            }
        } catch (err) {
            console.error('Error rejecting friend request:', err);
            // Display the error message from the API response
            alert(`Failed to reject friend request: ${err.message}`);
        }
    };

    return (
        <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
            <AppHeader title={"Friends"} />
            
            {/* Fixed elements outside of scrollable area */}
            <div className="flex justify-end px-4 py-2">
                <UserTagDisplay userId={currentUserId} />
            </div>
            
            <div className="px-4 py-2">
                <UserSearchBar onSearch={handleSearch} />
            </div>
            
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto px-4">
                {loading ? (
                    <div className="flex justify-center mt-8">
                        <p className="text-gray-500">Loading friends data...</p>
                    </div>
                ) : error ? (
                    <div className="flex justify-center mt-8">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : (
                    <div className="pb-6">
                        <PendingRequestsSection 
                            requests={pendingRequests}
                            onAccept={handleAcceptRequest}
                            onReject={handleRejectRequest}
                        />
                        <MyFriendsSection
                            friends={friends}
                            searchQuery={searchQuery}
                        />
                        <AllUsersSection 
                            users={allUsers}
                            searchQuery={searchQuery}
                            currentUserId={currentUserId}
                            friends={friends}
                            pendingRequests={pendingRequests}
                            onAdd={handleAddFriend}
                        />
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
}