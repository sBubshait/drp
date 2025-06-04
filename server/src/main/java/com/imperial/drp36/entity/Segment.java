package com.imperial.drp36.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "segments")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
public class Segment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "type", insertable = false, updatable = false)
  private String type;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  // Constructors
  public Segment() {
    this.createdAt = LocalDateTime.now();
  }

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getType() { return type; }
  public void setType(String type) { this.type = type; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}