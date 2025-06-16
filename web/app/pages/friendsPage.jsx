import React, { useState, useEffect } from 'react';
import AppHeader from "../components/site_layout/AppHeader";
import UserSearchBar from "../components/friends/UserSearchBar";
import PendingRequestsSection from "../components/friends/PendingRequestsSection";
import MyFriendsSection from "../components/friends/MyFriendsSection";
import AllUsersSection from "../components/friends/AllUsersSection";
import ApiService from "../services/api";
import { getUserId } from "../services/userApi";

export function FriendsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);

    // Fetch friends, pending requests, and all users
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
    
    // Separate function to refetch only friends data (used after adding a friend)
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
                // Show success notification (you could add a toast here)
                console.log('Friend request sent successfully');
                
                // Refetch friends data to update the UI
                fetchFriendsData();
            }
        } catch (err) {
            console.error('Error sending friend request:', err);
        }
    };

    const handleAcceptRequest = async (requesterId) => {
        try {
            const userId = await getUserId();
            const response = await ApiService.respondToFriend(userId, requesterId, 'accept');
            
            if (response.status === 200) {
                // Update UI after accepting friend request
                // Move from pending to friends
                const acceptedRequest = pendingRequests.find(req => req.id === requesterId);
                if (acceptedRequest) {
                    setPendingRequests(pendingRequests.filter(req => req.id !== requesterId));
                    setFriends([...friends, acceptedRequest]);
                }
            }
        } catch (err) {
            console.error('Error accepting friend request:', err);
        }
    };

    const handleRejectRequest = async (requesterId) => {
        try {
            const userId = await getUserId();
            const response = await ApiService.respondToFriend(userId, requesterId, 'ignore');
            
            if (response.status === 200) {
                // Remove from pending requests
                setPendingRequests(pendingRequests.filter(req => req.id !== requesterId));
            }
        } catch (err) {
            console.error('Error rejecting friend request:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AppHeader title={"Friends"} />
            <div className="container mx-auto py-6">
                <UserSearchBar onSearch={handleSearch} />
                
                {loading ? (
                    <div className="flex justify-center mt-8">
                        <p className="text-gray-500">Loading friends data...</p>
                    </div>
                ) : error ? (
                    <div className="flex justify-center mt-8">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : (
                    <div className="mt-6 px-4">
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
        </div>
    );
}