package com.imperial.drp36.model;

import java.util.List;

public class PollContentResponse extends FeedContentResponse {
  private List<String> options;
  private List<Long> responseCounts;
  private Long totalResponses;
  private Boolean allowsMultipleSelection;

  public PollContentResponse(Long id, String context, String title, List<String> options,
      List<Long> responseCounts, Long totalResponses, Boolean allowsMultipleSelection) {
    super(id, context, "poll", title);
    this.options = options;
    this.responseCounts = responseCounts;
    this.totalResponses = totalResponses;
    this.allowsMultipleSelection = allowsMultipleSelection;
  }

  public List<String> getOptions() {
    return options;
  }

  public List<Long> getResponseCounts() {
    return responseCounts;
  }

  public Long getTotalResponses() {
    return totalResponses;
  }

  public Boolean getAllowsMultipleSelection() {
    return allowsMultipleSelection;
  }

  public void setOptions(List<String> options) {
    this.options = options;
  }

  public void setResponseCounts(List<Long> responseCounts) {
    this.responseCounts = responseCounts;
  }

  public void setTotalResponses(Long totalResponses) {
    this.totalResponses = totalResponses;
  }

  public void setAllowsMultipleSelection(Boolean allowsMultipleSelection) {
    this.allowsMultipleSelection = allowsMultipleSelection;
  }
}
