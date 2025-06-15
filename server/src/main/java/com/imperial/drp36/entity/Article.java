package com.imperial.drp36.entity;


import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "articles")
public class Article {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "type", nullable = false)
  private String type; // "text" or "video"

  @Column(name = "content", columnDefinition = "TEXT", nullable = false)
  private String content; // summary content

  @Column(name = "category")
  private String category; // e.g., "Global Politics"

  @Column(name = "date_created", nullable = false)
  private LocalDateTime dateCreated;

  @Column(name = "total_interactions", nullable = false)
  private Long totalInteractions = 0L;

  @ElementCollection
  @CollectionTable(name = "article_segments", joinColumns = @JoinColumn(name = "article_id"))
  @Column(name = "segment_id")
  private List<Long> segments = new ArrayList<>();

  // Constructors
  public Article() {}

  public Article(String type, String content, String category, List<Long> segments) {
    this.type = type;
    this.content = content;
    this.category = category;
    this.segments = segments != null ? new ArrayList<>(segments) : new ArrayList<>();
    this.dateCreated = LocalDateTime.now();
    this.totalInteractions = 0L;
  }

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getType() { return type; }
  public void setType(String type) { this.type = type; }

  public String getContent() { return content; }
  public void setContent(String content) { this.content = content; }

  public String getCategory() { return category; }
  public void setCategory(String category) { this.category = category; }

  public LocalDateTime getDateCreated() { return dateCreated; }
  public void setDateCreated(LocalDateTime dateCreated) { this.dateCreated = dateCreated; }

  public Long getTotalInteractions() { return totalInteractions; }
  public void setTotalInteractions(Long totalInteractions) { this.totalInteractions = totalInteractions; }

  public void incrementInteractions() {
    this.totalInteractions = this.totalInteractions != null ? this.totalInteractions + 1 : 1L;
  }
  public List<Long> getSegments() { return segments; }
  public void setSegments(List<Long> segments) { this.segments = segments; }

}