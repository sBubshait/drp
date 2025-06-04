package com.imperial.drp36.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "discussions")
@DiscriminatorValue("discussion")
public class Discussion extends Segment {
  @Column(name = "prompt", columnDefinition = "TEXT", nullable = false)
  private String prompt;

  @Column(name = "total_responses")
  private Long totalResponses = 0L;

  public Discussion() {
    super();
  }

  public Discussion(String title, String context, String prompt) {
    super(title, context, "");
    this.prompt = prompt;
  }

  public String getPrompt() {
    return prompt;
  }

  public void setPrompt(String prompt) {
    this.prompt = prompt;
  }

  public Long getTotalResponses() {
    return totalResponses;
  }

  public void setTotalResponses(Long totalResponses) {
    this.totalResponses = totalResponses;
  }
}
