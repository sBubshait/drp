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
    // Don't include the current user
    if (user.id === currentUserId) return false;
    
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
  const isAlreadyFriend = (userId) => friends.some(friend => friend.id === userId);
  const isPendingRequest = (userId) => pendingRequests.some(request => request.id === userId);
  
  // Check if a user has sent us a friend request
  const hasIncomingRequest = (userId) => pendingRequests.some(request => request.id === userId);

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
            key={user.id}
            user={user}
            isPending={false}
            showAddButton={true}
            isAlreadyFriend={isAlreadyFriend(user.id)}
            isPendingRequest={isPendingRequest(user.id)}
            hasIncomingRequest={hasIncomingRequest(user.id)}
            onAdd={() => onAdd(user.tag)}
          />
        ))
      )}
    </CollapsibleContainer>
  );
}