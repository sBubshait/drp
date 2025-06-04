package com.imperial.drp36.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "polls")
@DiscriminatorValue("poll")
public class Poll extends Segment {
  @Column(name = "title", nullable = false)
  private String title;

  @Column(name = "context", columnDefinition = "TEXT")
  private String context;

  @Column(name = "options")
  @JdbcTypeCode(SqlTypes.JSON)
  private List<String> options = new ArrayList<>();

  @Column(name = "response_counts")
  @JdbcTypeCode(SqlTypes.JSON)
  private List<Long> responseCounts = new ArrayList<>();

  @Column(name = "total_responses")
  private Long totalResponses = 0L;

  // Constructors
  public Poll() {
    super();
  }

  public Poll(String title, String context, List<String> options) {
    super();
    this.title = title;
    this.context = context;
    this.options = options != null ? new ArrayList<>(options) : new ArrayList<>();
    this.responseCounts = new ArrayList<>();
    for (int i = 0; i < this.options.size(); i++) {
      this.responseCounts.add(0L);
    }
  }

  public void addResponse(Integer optionIndex) {
    if (optionIndex >= 0 && optionIndex < responseCounts.size()) {
      responseCounts.set(optionIndex, responseCounts.get(optionIndex) + 1);
      totalResponses++;
    }
  }

  // Getters and Setters
  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getContext() { return context; }
  public void setContext(String context) { this.context = context; }

  public List<String> getOptions() { return options; }
  public void setOptions(List<String> options) { this.options = options; }

  public List<Long> getResponseCounts() { return responseCounts; }
  public void setResponseCounts(List<Long> responseCounts) { this.responseCounts = responseCounts; }

  public Long getTotalResponses() { return totalResponses; }
  public void setTotalResponses(Long totalResponses) { this.totalResponses = totalResponses; }
}