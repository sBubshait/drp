import React, { useState, useEffect } from 'react';
import ApiService from "../../services/api";

export default function UserTagDisplay({ userId }) {
  const [userTag, setUserTag] = useState('');
  
  useEffect(() => {
    async function fetchUserTag() {
      if (!userId) return;
      
      try {
        // Use getUserData instead of getAllUsers for efficiency
        const user = await ApiService.getUserData(userId);
        if (user) {
          setUserTag(user.tag);
        }
      } catch (err) {
        console.error('Error fetching user tag:', err);
      }
    }
    
    fetchUserTag();
  }, [userId]);
  
  if (!userTag) return null;
  
  return (
    <div className="bg-cyan-100 text-cyan-800 px-4 py-1 rounded-full font-medium border border-cyan-200 shadow-sm flex items-center">
      <p className="text-blue-400 font-bold mr-1 mb-1">@</p>
      <p className="text-cyan-800">{userTag}</p>
    </div>
  );
}