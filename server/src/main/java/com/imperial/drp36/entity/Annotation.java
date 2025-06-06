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

  @Column(name = "startPos", nullable = false)
  private Integer startPos;

  public Annotation() {
    this.createdAt = LocalDateTime.now();
  }

  public Annotation(Long id, Long infoId, String content, String authorName, String authorCredentials, Integer startPos, Integer endPos) {
    this();
    this.id = id;
    this.infoId = infoId;
    this.content = content;
    this.authorName = authorName;
    this.authorCredentials = authorCredentials;
    this.startPos = start;
    this.endPos = endPos;
  }
  @Column(name = "endPos", nullable = false)
  private Integer endPos;

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

  public Integer getStartPos() {
    return startPos;
  }

  public void setStartPos(Integer start) {
    this.startPos = start;
  }

  public Integer getEndPos() {
    return endPos;
  }

  public void setEndPos(Integer endPos) {
    this.endPos = endPos;
  }
}
