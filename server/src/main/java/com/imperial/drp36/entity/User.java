package com.imperial.drp36.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Random;

@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "tag", nullable = false, unique = true, length = 50)
  private String tag;

  @Column(name = "last_complete", nullable = true)
  private LocalDateTime lastComplete;

  @Column(name = "streak", nullable = false)
  private Integer streak;

  @Column(name = "xp", nullable = false)
  private Integer xp;

  public User() {
    this.tag = generateRandomTag();
    this.xp = 0;
    this.streak = 0;
  }

  public User(Integer streak) {
    this.tag = generateRandomTag();
    this.streak = streak;
    this.xp = 0;
  }

  public User(String tag, Integer streak, Integer xp) {
    this.tag = tag;
    this.streak = streak;
    this.xp = xp;
  }

  public User(Long id, String tag, Integer streak, Integer xp, LocalDateTime lastComplete) {
    this.id = id;
    this.tag = tag;
    this.streak = streak;
    this.xp = xp;
    this.lastComplete = lastComplete;
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

  public String getTag() {
    return tag;
  }

  public void setTag(String tag) {
    this.tag = tag;
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

  private static final String[] ADJECTIVES = {
      "Anonymous", "Silent", "Swift", "Bright", "Cool", "Real", "Wild", "Bold",
      "Quick", "Smart", "Happy", "Lucky", "Stealth", "Golden", "Silver", "Mystic"
  };

  private static final String[] ANIMALS = {
      "Panda", "Rabbit", "Tiger", "Eagle", "Wolf", "Fox", "Bear", "Shark",
      "Lion", "Hawk", "Owl", "Cat", "Dog", "Deer", "Falcon", "Dragon"
  };

  private static final Random random = new Random();

  public static String generateRandomTag() {
    String adjective = ADJECTIVES[random.nextInt(ADJECTIVES.length)];
    String animal = ANIMALS[random.nextInt(ANIMALS.length)];
    return adjective + animal;
  }
}