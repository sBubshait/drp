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
  
  // Extract two capital letters from the tag
  const getInitials = (tag) => {
    if (!tag) return '??';
    
    // Remove @ if present
    const cleanTag = tag.startsWith('@') ? tag.substring(1) : tag;
    
    // Find capital letters in the tag (UserTags like "AnonymousPanda")
    const capitals = cleanTag.match(/[A-Z]/g) || [];
    
    if (capitals.length >= 2) {
      // Return first two capital letters
      return capitals[0] + capitals[1];
    } else if (capitals.length === 1) {
      // If only one capital, use it and the next letter
      const index = cleanTag.indexOf(capitals[0]);
      const nextChar = index + 1 < cleanTag.length ? cleanTag[index + 1] : '';
      return capitals[0] + nextChar;
    } else {
      // Fallback to first two characters
      return cleanTag.substring(0, 2).toUpperCase();
    }
  };
  
  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200 last:border-0">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">
          {getInitials(user.tag)}
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
            Friend
          </button>
          <button 
            onClick={() => onReject(user.id)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded text-sm"
          >
            Dismiss
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