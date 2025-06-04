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
  @Column(name = "options")
  @JdbcTypeCode(SqlTypes.JSON)
  private List<String> options = new ArrayList<>();

  @Column(name = "response_counts")
  @JdbcTypeCode(SqlTypes.JSON)
  private List<Long> responseCounts = new ArrayList<>();

  @Column(name = "total_responses")
  private Long totalResponses = 0L;

  @Column(name = "allows_multiple_selection")
  private Boolean allowsMultipleSelection = false;

  // Constructors
  public Poll() {
    super();
  }

  public Poll(String title, String context, String createdBy,
      List<String> options, Boolean allowsMultipleSelection) {
    super(title, context, createdBy);
    this.options = options != null ? new ArrayList<>(options) : new ArrayList<>();
    this.allowsMultipleSelection = allowsMultipleSelection;
    // Initialize response counts to zero for each option
    this.responseCounts = new ArrayList<>();
    for (int i = 0; i < this.options.size(); i++) {
      this.responseCounts.add(0L);
    }
  }

  // Getters and Setters
  public List<String> getOptions() { return options; }
  public void setOptions(List<String> options) {
    this.options = options != null ? new ArrayList<>(options) : new ArrayList<>();
    // Adjust response counts array size
    adjustResponseCountsSize();
  }

  public List<Long> getResponseCounts() { return responseCounts; }
  public void setResponseCounts(List<Long> responseCounts) {
    this.responseCounts = responseCounts != null ? new ArrayList<>(responseCounts) : new ArrayList<>();
  }

  public Long getTotalResponses() { return totalResponses; }
  public void setTotalResponses(Long totalResponses) { this.totalResponses = totalResponses; }

  public Boolean getAllowsMultipleSelection() { return allowsMultipleSelection; }
  public void setAllowsMultipleSelection(Boolean allowsMultipleSelection) {
    this.allowsMultipleSelection = allowsMultipleSelection;
  }

  // Helper methods
  public void addResponse(int optionIndex) {
    if (optionIndex >= 0 && optionIndex < responseCounts.size()) {
      responseCounts.set(optionIndex, responseCounts.get(optionIndex) + 1);
      totalResponses++;
    }
  }

  public void addMultipleResponses(List<Integer> optionIndices) {
    if (allowsMultipleSelection) {
      for (Integer index : optionIndices) {
        if (index >= 0 && index < responseCounts.size()) {
          responseCounts.set(index, responseCounts.get(index) + 1);
        }
      }
      totalResponses++;
    }
  }

  public Double getResponseFrequency(int optionIndex) {
    if (optionIndex >= 0 && optionIndex < responseCounts.size() && totalResponses > 0) {
      return (responseCounts.get(optionIndex).doubleValue() / totalResponses.doubleValue()) * 100;
    }
    return 0.0;
  }

  public void addOption(String option) {
    this.options.add(option);
    this.responseCounts.add(0L);
  }

  private void adjustResponseCountsSize() {
    while (responseCounts.size() < options.size()) {
      responseCounts.add(0L);
    }
    while (responseCounts.size() > options.size()) {
      responseCounts.remove(responseCounts.size() - 1);
    }
  }
}
