package com.imperial.drp36.model;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "Article content with segments")
public class ArticleContent {
  @Schema(description = "Article ID", example = "1")
  private Long id;

  @Schema(description = "Article type", example = "text")
  private String type;

  @Schema(description = "Article content/summary", example = "Summary of the article...")
  private String content;

  @Schema(description = "Article category", example = "Global Politics")
  private String category;

  private LocalDateTime dateCreated;
  private Long totalInteractions;

  @Schema(description = "List of segments in this article")
  private List<SegmentContent> segments;

  // Constructors
  public ArticleContent() {}

  public ArticleContent(Long id, String type, String content, String category,LocalDateTime dateCreated, Long totalInteractions, List<SegmentContent> segments) {
    this.id = id;
    this.type = type;
    this.content = content;
    this.category = category;
    this.dateCreated = dateCreated;
    this.totalInteractions = totalInteractions;
    this.segments = segments;
  }

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getType() { return type; }
  public void setType(String type) { this.type = type; }

  public String getContent() { return content; }
  public void setContent(String content) { this.content = content; }

  public String getCategory() { return category; }
  public void setCategory(String category) { this.category = category; }


  public LocalDateTime getDateCreated() { return dateCreated; }
  public void setDateCreated(LocalDateTime dateCreated) { this.dateCreated = dateCreated; }

  public Long getTotalInteractions() { return totalInteractions; }
  public void setTotalInteractions(Long totalInteractions) { this.totalInteractions = totalInteractions; }


  public List<SegmentContent> getSegments() { return segments; }
  public void setSegments(List<SegmentContent> segments) { this.segments = segments; }
}