package com.imperial.drp36.entity;

import jakarta.persistence.*;

import java.util.List;

import static jakarta.persistence.CascadeType.ALL;

@Entity
@IdClass(ArticleSegmentId.class)
@Table(name = "article_segments")
public class ArticleSegment {

  @Id
  @Column(name = "article_id")
  private Long articleId;

  @Id
  @Column(name = "segment_id")
  private Long segmentId;

  public Long getSegmentId() {
	return segmentId;
}

public void setSegmentId(Long segmentId) {
	this.segmentId = segmentId;
}

public Long getArticleId() {
	return articleId;
}

public void setArticleId(Long articleId) {
	this.articleId = articleId;
}
}
