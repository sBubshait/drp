import React from 'react';
import CollapsibleContainer from '../ui/CollapsibleContainer';
import FriendItem from './FriendItem';

export default function PendingRequestsSection({ requests, onAccept, onReject }) {
  // If there are no requests, force the container to be closed
  const hasRequests = requests.length > 0;
  
  return (
    <CollapsibleContainer 
      title="Incoming Friend Requests" 
      count={requests.length} 
      initiallyOpen={hasRequests}
      forceOpen={hasRequests ? undefined : false} // Force closed when no requests
      disabled={!hasRequests} // Disable clicking when no requests
    >
      {!hasRequests ? (
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