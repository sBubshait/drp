import React from 'react';
import CollapsibleContainer from '../ui/CollapsibleContainer';
import FriendItem from './FriendItem';

export default function AllUsersSection({ 
  users, 
  searchQuery, 
  currentUserId, 
  friends, 
  pendingRequests, 
  onAdd 
}) {
  // Filter users based on search query if one exists
  const filteredUsers = users.filter(user => {
    // Explicitly ensure we don't include the current user in the list
    // Convert both to strings to handle potential type differences
    if (String(user.id) === String(currentUserId) || 
        String(user.userId) === String(currentUserId)) {
      return false;
    }
    
    // If there's a search query, filter by tag
    if (searchQuery && searchQuery.replace(/^@/, '').length > 0) {
      const query = searchQuery.replace(/^@/, '').toLowerCase();
      return user.tag.toLowerCase().includes(query);
    }
    
    // If no search query, show all users
    return true;
  });

  // Determine if the section should be initially open
  const isSearching = searchQuery && searchQuery.replace(/^@/, '').length > 0;
  
  // Check if a user is already a friend or has a pending request
  const isAlreadyFriend = (userId) => friends.some(friend => 
    String(friend.id) === String(userId) || String(friend.userId) === String(userId)
  );
  
  // Check if we sent a pending request to this user
  const isPendingRequest = (userId) => pendingRequests.some(request => 
    String(request.id) === String(userId) || String(request.userId) === String(userId)
  );
  
  // Check if a user has sent us a friend request
  const hasIncomingRequest = (userId) => pendingRequests.some(request => 
    String(request.id) === String(userId) || String(request.userId) === String(userId)
  );

  // Additional safety check before adding a friend
  const handleAddFriend = (friendTag) => {
    // Don't allow adding if this is somehow the current user
    if (filteredUsers.find(u => u.tag === friendTag && 
        (String(u.id) === String(currentUserId) || String(u.userId) === String(currentUserId)))) {
      alert("You cannot add yourself as a friend");
      return;
    }
    
    onAdd(friendTag);
  };

  return (
    <CollapsibleContainer 
      title="All Users" 
      count={filteredUsers.length} 
      initiallyOpen={false}
      // Only force open when actively searching
      forceOpen={isSearching ? true : undefined}
    >
      {filteredUsers.length === 0 ? (
        <div className="py-4 px-4 text-center text-gray-500">
          {isSearching 
            ? `No users found matching "${searchQuery}"`
            : "No other users available"}
        </div>
      ) : (
        filteredUsers.map(user => (
          <FriendItem 
            key={user.id || user.userId}
            user={user}
            isPending={false}
            showAddButton={true}
            isAlreadyFriend={isAlreadyFriend(user.id || user.userId)}
            isPendingRequest={isPendingRequest(user.id || user.userId)}
            hasIncomingRequest={hasIncomingRequest(user.id || user.userId)}
            onAdd={() => handleAddFriend(user.tag)}
          />
        ))
      )}
    </CollapsibleContainer>
  );
}