package com.imperial.drp36.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "user_segments")
public class UserArticleSegment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "segment_id", nullable = false)
  private Long segmentId;

  public Long getSegmentId() {
	return segmentId;
}

public void setSegmentId(Long segmentId) {
	this.segmentId = segmentId;
}
  @OneToMany
  @JoinColumn(name = "segment_id", referencedColumnName = "segment_id")
  private List<ArticleSegment> articleSegment;

  // Constructors
  public UserArticleSegment() {
  }

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public Long getUserId() { return userId; }
  public void setUserId(Long userId) { this.userId = userId; }

  public List<ArticleSegment> getArticleSegment() {
    return articleSegment;
  }

  public void setArticleSegment(List<ArticleSegment> articleSegment) {
    this.articleSegment = articleSegment;
  }
}
