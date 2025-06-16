package com.imperial.drp36.services;

import com.imperial.drp36.entity.Friend;
import com.imperial.drp36.entity.User;
import com.imperial.drp36.model.FriendsResponse;
import com.imperial.drp36.repository.FriendRepository;
import com.imperial.drp36.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@Transactional
public class FriendService {
  @Autowired
  private FriendRepository friendRepository;

  @Autowired
  private UserRepository userRepository;

  public String addFriend(Long userId, String friendTag) {
    // Find friend by tag
    Optional<User> friendOptional = userRepository.findByTag(friendTag);
    if (!friendOptional.isPresent()) {
      return "User with tag '" + friendTag + "' not found";
    }

    User friend = friendOptional.get();

    // Can't add yourself
    if (friend.getId().equals(userId)) {
      return "Cannot add yourself as a friend";
    }

    // Check if user already has this person as friend
    if (friendRepository.existsByUserIdAndFriendId(userId, friend.getId())) {
      return "User is already a friend!";
    }

    // Create one-way friendship with pending status (User 1 -> User 2)
    // This represents: User 1 has User 2 as friend, but User 2 hasn't responded yet
    Friend friendship = new Friend(userId, friend.getId(), "pending");
    friendRepository.save(friendship);

    return "SUCCESS";
  }

  public FriendsResponse getFriends(Long userId) {
    try {
      // Get friends where this user is the one who added them (userId -> friendId)
      // Include both accepted and pending (pending means they added someone but waiting for response)
      List<Friend> userFriendships = friendRepository.findByUserId(userId);
      List<User> friends = new ArrayList<>();

      for (Friend friendship : userFriendships) {
        Optional<User> userOptional = userRepository.findById(friendship.getFriendId());
        if (userOptional.isPresent()) {
          User user = userOptional.get();
          friends.add(new User(
              user.getId(),
              user.getTag(),
              user.getXp(),
              user.getStreak(),
              user.getLastComplete()
          ));
        }
      }

      // Get friend requests (where this user is the friend being added - friendId)
      // These are pending requests from others
      List<Friend> incomingRequests = friendRepository.findByFriendIdAndStatus(userId, "pending");
      List<User> requests = new ArrayList<>();

      for (Friend request : incomingRequests) {
        Optional<User> userOptional = userRepository.findById(request.getUserId());
        if (userOptional.isPresent()) {
          User user = userOptional.get();
          requests.add(new User(
              user.getId(),
              user.getTag(),
              user.getXp(),
              user.getStreak(),
              request.getCreatedAt()
          ));
        }
      }

      return new FriendsResponse(200, "Success", requests, friends);
    } catch (Exception e) {
      return new FriendsResponse(500, "Error retrieving friends: " + e.getMessage());
    }
  }

  public boolean respondToFriendRequest(Long userId, Long requesterId, String action) {
    try {
      // Find the friendship request (requesterId -> userId with pending status)
      Optional<Friend> requestOptional = friendRepository.findByUserIdAndFriendIdAndStatus(requesterId, userId, "pending");
      if (!requestOptional.isPresent()) {
        return false;
      }

      Friend request = requestOptional.get();

      if (action.equals("accept")) {
        // Change status to accepted for the original request
        request.setStatus("accepted");
        friendRepository.save(request);

        // Create reverse friendship (userId -> requesterId with accepted status)
        if (!friendRepository.existsByUserIdAndFriendId(userId, requesterId)) {
          Friend reverseFriendship = new Friend(userId, requesterId, "accepted");
          friendRepository.save(reverseFriendship);
        }
      } else if (action.equals("ignore")) {
        // Change status to ignored so request doesn't show up again
        request.setStatus("ignored");
        friendRepository.save(request);
      } else {
        return false;
      }

      return true;
    } catch (Exception e) {
      return false;
    }
  }
}