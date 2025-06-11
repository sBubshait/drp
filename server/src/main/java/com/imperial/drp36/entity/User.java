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

  public User() {
    this.lastComplete = null;
  }

  public User(Integer streak) {
    this();
    this.streak = streak;
  }

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
}
