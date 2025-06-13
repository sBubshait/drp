package com.imperial.drp36.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "last_complete", nullable = true)
  private LocalDateTime lastComplete;

  @Column(name = "streak", nullable = false)
  private Integer streak;

  @Column(name = "xp", nullable = false)
  private Integer xp;

  public User() {
    this.lastComplete = null;
    this.xp = 0; // Initialize XP to 0
  }

  public User(Integer streak) {
    this();
    this.streak = streak;
    this.xp = 0; // Initialize XP to 0
  }

  public User(Integer streak, Integer xp) {
    this();
    this.streak = streak;
    this.xp = xp;
  }

  // Existing getters and setters
  public Integer getStreak() {
    return streak;
  }

  public void setStreak(Integer streak) {
    this.streak = streak;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public LocalDateTime getLastComplete() {
    return lastComplete;
  }

  public void setLastComplete(LocalDateTime lastComplete) {
    this.lastComplete = lastComplete;
  }

  // New XP getters and setters
  public Integer getXp() {
    return xp;
  }

  public void setXp(Integer xp) {
    this.xp = xp;
  }

  // Helper method to add XP
  public void addXp(Integer amount) {
    if (amount != null && amount > 0) {
      this.xp += amount;
    }
  }
}