package com.imperial.drp36.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "discussions")
@DiscriminatorValue("discussion")
public class Discussion extends Segment {
  @Column(name = "context", columnDefinition = "TEXT")
  private String context;

  @Column(name = "prompt", columnDefinition = "TEXT", nullable = false)
  private String prompt;

  @Column(name = "total_responses")
  private Long totalResponses = 0L;

  // Constructors
  public Discussion() {
    super();
  }

  public Discussion(String context, String prompt) {
    super();
    this.context = context;
    this.prompt = prompt;
  }

  // Getters and Setters
  public String getContext() { return context; }
  public void setContext(String context) { this.context = context; }

  public String getPrompt() { return prompt; }
  public void setPrompt(String prompt) { this.prompt = prompt; }

  public Long getTotalResponses() { return totalResponses; }
  public void setTotalResponses(Long totalResponses) { this.totalResponses = totalResponses; }
}