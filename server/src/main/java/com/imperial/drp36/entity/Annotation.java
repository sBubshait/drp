package com.imperial.drp36.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "annotations")
public class Annotation {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "info_id", nullable = false)
  private Long infoId;

  @Column(name = "content", columnDefinition = "TEXT", nullable = false)
  private String content;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @Column(name = "author_name", nullable = false)
  private String authorName;

  @Column(name = "author_credentials", nullable = false)
  private String authorCredentials;

  @Column(name = "start", nullable = false)
  private Integer start;

  public Annotation() {
    this.createdAt = LocalDateTime.now();
  }

  public Annotation(Long id, Long infoId, String content, String authorName, String authorCredentials, Integer start, Integer end) {
    this();
    this.id = id;
    this.infoId = infoId;
    this.content = content;
    this.authorName = authorName;
    this.authorCredentials = authorCredentials;
    this.start = start;
    this.end = end;
  }
  @Column(name = "end", nullable = false)
  private Integer end;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public Long getInfoId() {
    return infoId;
  }

  public void setInfoId(Long infoId) {
    this.infoId = infoId;
  }

  public String getAuthorName() {
    return authorName;
  }

  public void setAuthorName(String authorName) {
    this.authorName = authorName;
  }

  public String getAuthorCredentials() {
    return authorCredentials;
  }

  public void setAuthorCredentials(String authorCredentials) {
    this.authorCredentials = authorCredentials;
  }

  public Integer getStart() {
    return start;
  }

  public void setStart(Integer start) {
    this.start = start;
  }

  public Integer getEnd() {
    return end;
  }

  public void setEnd(Integer end) {
    this.end = end;
  }
}
