import React, { useState, useEffect } from 'react';
import AppHeader from "../components/site_layout/AppHeader";
import UserSearchBar from "../components/friends/UserSearchBar";
import PendingRequestsSection from "../components/friends/PendingRequestsSection";
import MyFriendsSection from "../components/friends/MyFriendsSection";
import ApiService from "../services/api";
import { getUserId } from "../services/userApi";

export function FriendsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch friends and pending requests
    useEffect(() => {
        async function fetchFriendsData() {
            try {
                setLoading(true);
                setError(null);
                
                const userId = await getUserId();
                const response = await ApiService.getFriends(userId);
                
                if (response.status === 200) {
                    // Set friends data using the expected response format
                    setFriends(response.friends || []);
                    setPendingRequests(response.requests || []);
                } else {
                    setError(response.message || 'Failed to load friends');
                }
            } catch (err) {
                console.error('Error fetching friends:', err);
                setError('Error loading friends data. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchFriendsData();
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        // You can implement the actual search functionality here
        console.log("Searching for:", query);
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
                        <MyFriendsSection friends={friends} />
                    </div>
                )}
                
                {searchQuery && (
                    <div className="mt-8 px-4">
                        <p className="text-gray-600">Searching for: {searchQuery}</p>
                        {/* Search results would go here */}
                    </div>
                )}
            </div>
        </div>
    );
}