import React from 'react';
import CollapsibleContainer from '../ui/CollapsibleContainer';
import FriendItem from './FriendItem';

export default function MyFriendsSection({ friends }) {
  return (
    <CollapsibleContainer title="My Friends" count={friends.length} initiallyOpen={true}>
      {friends.length === 0 ? (
        <div className="py-4 px-4 text-center text-gray-500">
          You don't have any friends yet. Search for users to add them!
        </div>
      ) : (
        friends.map(friend => (
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