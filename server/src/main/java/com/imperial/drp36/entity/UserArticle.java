package com.imperial.drp36.entity;

import jakarta.persistence.*;

// Entry created when swiped right

@Entity
@Table(name = "user_articles")
public class UserArticle {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "article_id", nullable = false)
  private Long articleId;

  @Column(name = "completed", nullable = false)
  private Boolean completed = true;

  // Constructors
  public UserArticle() {}

  public UserArticle(Long userId, Long articleId) {
    this.userId = userId;
    this.articleId = articleId;
    this.completed = true;
  }

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public Long getUserId() { return userId; }
  public void setUserId(Long userId) { this.userId = userId; }

  public Long getArticleId() { return articleId; }
  public void setArticleId(Long articleId) { this.articleId = articleId; }

  public Boolean getCompleted() { return completed; }
  public void setCompleted(Boolean completed) { this.completed = completed; }
}