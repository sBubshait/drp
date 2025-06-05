package com.imperial.drp36.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response object for article-related operations")
public class ArticleResponse {
  @Schema(description = "HTTP status code", example = "200")
  private int status;

  @Schema(description = "ID of the previous article", example = "0")
  private Long prev;

  @Schema(description = "ID of the next article", example = "2")
  private Long next;

  @Schema(description = "Article content")
  private ArticleContent article;

  // Constructors
  public ArticleResponse(int status) {
    this.status = status;
  }

  public ArticleResponse(int status, Long prev, Long next, ArticleContent article) {
    this.status = status;
    this.prev = prev;
    this.next = next;
    this.article = article;
  }

  // Getters and Setters
  public int getStatus() { return status; }
  public void setStatus(int status) { this.status = status; }

  public Long getPrev() { return prev; }
  public void setPrev(Long prev) { this.prev = prev; }

  public Long getNext() { return next; }
  public void setNext(Long next) { this.next = next; }

  public ArticleContent getArticle() { return article; }
  public void setArticle(ArticleContent article) { this.article = article; }
}