package com.imperial.drp36.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_segments")
public class UserSegment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "segment_id", nullable = false)
  private Long segmentId;

  // Constructors
  public UserSegment() {}

  public UserSegment(Long userId, Long segmentId) {
    this.userId = userId;
    this.segmentId = segmentId;
  }

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public Long getUserId() { return userId; }
  public void setUserId(Long userId) { this.userId = userId; }

  public Long getSegmentId() { return segmentId; }
  public void setSegmentId(Long segmentId) { this.segmentId = segmentId; }
}