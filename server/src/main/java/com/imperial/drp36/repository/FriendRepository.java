package com.imperial.drp36.repository;

import com.imperial.drp36.entity.Friend;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Long> {
  List<Friend> findByUserId(Long userId); // Get all friendships where user is the one who added
  List<Friend> findByUserIdAndStatus(Long userId, String status);
  List<Friend> findByFriendIdAndStatus(Long friendId, String status);
  Optional<Friend> findByUserIdAndFriendId(Long userId, Long friendId);
  Optional<Friend> findByUserIdAndFriendIdAndStatus(Long userId, Long friendId, String status);
  boolean existsByUserIdAndFriendId(Long userId, Long friendId);
}