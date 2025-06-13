package com.imperial.drp36.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

import java.io.Serializable;

public class ArticleSegmentId implements Serializable {

  public ArticleSegmentId(Long articleId, Long segmentId) {
    this.articleId = articleId;
    this.segmentId = segmentId;
  }

  private Long articleId;
  private Long segmentId;

  public Long getArticleId() {
    return articleId;
  }

  public void setArticleId(Long articleId) {
    this.articleId = articleId;
  }

  public Long getSegmentId() {
    return segmentId;
  }

  public void setSegmentId(Long segmentId) {
    this.segmentId = segmentId;
  }
}
