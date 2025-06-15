package com.imperial.drp36.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "friends")
public class Friend {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "friend_id", nullable = false)
  private Long friendId;

  @Column(name = "status", nullable = false)
  private String status; // "pending", "accepted", "ignored"

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  public Friend() {
    this.createdAt = LocalDateTime.now();
    this.status = "pending";
  }

  public Friend(Long userId, Long friendId) {
    this();
    this.userId = userId;
    this.friendId = friendId;
  }

  public Friend(Long userId, Long friendId, String status) {
    this();
    this.userId = userId;
    this.friendId = friendId;
    this.status = status;
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public Long getFriendId() {
    return friendId;
  }

  public void setFriendId(Long friendId) {
    this.friendId = friendId;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }
}