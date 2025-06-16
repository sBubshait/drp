import React from 'react';

export default function FriendItem({ 
  user, 
  isPending = false, 
  showAddButton = false, 
  isAlreadyFriend = false,
  isPendingRequest = false,
  onAccept, 
  onReject, 
  onAdd 
}) {
  // Determine button state and text
  const addButtonDisabled = isAlreadyFriend || isPendingRequest;
  const addButtonText = isAlreadyFriend ? "Already Friends" : 
                         isPendingRequest ? "Request Pending" : 
                         "Add Friend";
  
  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200 last:border-0">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">
          {user.tag ? user.tag.charAt(1).toUpperCase() : '?'}
        </div>
        <div className="ml-3">
          <div className="font-medium text-gray-800">{user.tag}</div>
          <div className="text-sm text-gray-500">XP: {user.xp || 0} • Streak: {user.streak || 0}</div>
        </div>
      </div>
      
      {isPending && (
        <div className="flex space-x-2">
          <button 
            onClick={() => onAccept(user.id)}
            className="bg-cyan-600 hover:bg-cyan-700 text-white py-1 px-3 rounded text-sm"
          >
            Accept
          </button>
          <button 
            onClick={() => onReject(user.id)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded text-sm"
          >
            Decline
          </button>
        </div>
      )}
      
      {showAddButton && (
        <button 
          onClick={() => !addButtonDisabled && onAdd(user.tag)}
          className={`py-1 px-3 rounded text-sm ${
            addButtonDisabled 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-cyan-600 hover:bg-cyan-700 text-white'
          }`}
          disabled={addButtonDisabled}
        >
          {addButtonText}
        </button>
      )}
    </div>
  );
}