package com.imperial.drp36.model;

public class FeedResponse {
  private int status;
  private Long prev;
  private Long next;
  private Integer articleIndex;
  private FeedContentResponse content;
  private String createdAt;
  private String source;

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

  // Getters
  public int getStatus() { return status; }
  public Long getPrev() { return prev; }
  public Long getNext() { return next; }
  public Integer getArticleIndex() { return articleIndex; }
  public FeedContentResponse getContent() { return content; }
  public String getCreatedAt() { return createdAt; }
  public String getSource() { return source; }

  // Setters
  public void setStatus(int status) { this.status = status; }
  public void setPrev(Long prev) { this.prev = prev; }
  public void setNext(Long next) { this.next = next; }
  public void setArticleIndex(Integer articleIndex) { this.articleIndex = articleIndex; }
  public void setContent(FeedContentResponse content) { this.content = content; }
  public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
  public void setSource(String source) { this.source = source; }
}
