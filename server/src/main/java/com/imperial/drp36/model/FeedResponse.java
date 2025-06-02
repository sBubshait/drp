package com.imperial.drp36.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response object for feed-related operations")
public class FeedResponse {

  @Schema(description = "HTTP status code", example = "200")
  private int status;

  @Schema(description = "ID of the previous feed item", example = "0")
  private Long prev;

  @Schema(description = "ID of the next feed item", example = "2")
  private Long next;

  @Schema(description = "Index of the current article", example = "1")
  private Integer articleIndex;

  @Schema(description = "Content of the feed item, this can be a question, poll, etc. See Schema below")
  private FeedContentResponse content;

  @Schema(description = "Creation timestamp of the feed item", example = "2023-12-01T10:30:00")
  private String createdAt;

  @Schema(description = "Source of the feed content", example = "BBC News")
  private String source;

  // Constructors
  public FeedResponse(int status) {
    this.status = status;
  }

  public FeedResponse(int status, Long prev, Long next, Integer articleIndex,
      FeedContentResponse content, String createdAt, String source) {
    this.status = status;
    this.prev = prev;
    this.next = next;
    this.articleIndex = articleIndex;
    this.content = content;
    this.createdAt = createdAt;
    this.source = source;
  }

  // Getters and Setters remain the same...
  public int getStatus() { return status; }
  public Long getPrev() { return prev; }
  public Long getNext() { return next; }
  public Integer getArticleIndex() { return articleIndex; }
  public FeedContentResponse getContent() { return content; }
  public String getCreatedAt() { return createdAt; }
  public String getSource() { return source; }

  public void setStatus(int status) { this.status = status; }
  public void setPrev(Long prev) { this.prev = prev; }
  public void setNext(Long next) { this.next = next; }
  public void setArticleIndex(Integer articleIndex) { this.articleIndex = articleIndex; }
  public void setContent(FeedContentResponse content) { this.content = content; }
  public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
  public void setSource(String source) { this.source = source; }
}