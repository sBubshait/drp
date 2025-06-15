package com.imperial.drp36.model;

import java.util.ArrayList;
import java.util.List;

public class AllArticlesResponse {
  private Integer status;
  private String message;
  private List<ArticleContent> articles;
  private Long totalCount;

  public AllArticlesResponse(Integer status) {
    this.status = status;
    this.articles = new ArrayList<>();
    this.totalCount = 0L;
  }

  public AllArticlesResponse(Integer status, List<ArticleContent> articles, Long totalCount) {
    this.status = status;
    this.articles = articles;
    this.totalCount = totalCount;
  }

  public AllArticlesResponse(Integer status, String message) {
    this.status = status;
    this.message = message;
    this.articles = new ArrayList<>();
    this.totalCount = 0L;
  }

  // Getters and Setters
  public Integer getStatus() { return status; }
  public void setStatus(Integer status) { this.status = status; }

  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }

  public List<ArticleContent> getArticles() { return articles; }
  public void setArticles(List<ArticleContent> articles) { this.articles = articles; }

  public Long getTotalCount() { return totalCount; }
  public void setTotalCount(Long totalCount) { this.totalCount = totalCount; }
}