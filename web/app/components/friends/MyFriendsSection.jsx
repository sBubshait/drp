import React from 'react';
import CollapsibleContainer from '../ui/CollapsibleContainer';
import FriendItem from './FriendItem';

export default function MyFriendsSection({ friends, searchQuery }) {
  // Filter friends based on search query if one exists
  const filteredFriends = searchQuery 
    ? friends.filter(friend => {
        const query = searchQuery.replace(/^@/, '').toLowerCase();
        return friend.tag.toLowerCase().includes(query);
      })
    : friends;
  
  // Determine if we should show all friends or only filtered ones
  const displayCount = searchQuery ? filteredFriends.length : friends.length;
  const isSearching = searchQuery && searchQuery.replace(/^@/, '').length > 0;
  
  return (
    <CollapsibleContainer 
      title="My Friends" 
      count={displayCount}
      initiallyOpen={true}
      // Keep the section open during search if there are matches
      forceOpen={isSearching && filteredFriends.length > 0 ? true : undefined}
    >
      {filteredFriends.length === 0 ? (
        <div className="py-4 px-4 text-center text-gray-500">
          {isSearching 
            ? `No friends matching "${searchQuery}"`
            : "You don't have any friends yet. Search for users to add them!"}
        </div>
      ) : (
        filteredFriends.map(friend => (
          <FriendItem 
            key={friend.id}
            user={friend}
            isPending={false}
          />
        ))
      )}
    </CollapsibleContainer>
  );
}