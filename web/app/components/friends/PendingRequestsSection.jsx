import React from 'react';
import CollapsibleContainer from '../ui/CollapsibleContainer';
import FriendItem from './FriendItem';

export default function PendingRequestsSection({ requests, onAccept, onReject }) {
  return (
    <CollapsibleContainer title="Incoming Friend Requests" count={requests.length} initiallyOpen={requests.length > 0}>
      {requests.length === 0 ? (
        <div className="py-4 px-4 text-center text-gray-500">
          No incoming friend requests
        </div>
      ) : (
        requests.map(request => (
          <FriendItem 
            key={request.id}
            user={request}
            isPending={true}
            onAccept={onAccept}
            onReject={onReject}
          />
        ))
      )}
    </CollapsibleContainer>
  );
}