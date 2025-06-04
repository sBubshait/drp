package com.imperial.drp36.model;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;


public class PollContent extends SegmentContent {

  @Schema(
      description = "Title of the poll",
      example = "Was the government's intervention necessary?",
      requiredMode = Schema.RequiredMode.REQUIRED
  )
  private String title;

  @Schema(
      description = "Context or background information for the poll",
      example = "In response to the recent crisis, the government implemented several measures to stabilize the economy.",
      requiredMode = Schema.RequiredMode.REQUIRED
  )
  private String context;

  @Schema(
      description = "List of poll options that users can vote on",
      example = "[\"It was necessary\", \"It was reasonable\", \"It overstepped\", \"It's an abuse of power\"]",
      requiredMode = Schema.RequiredMode.REQUIRED
  )
  private List<String> options;

  @Schema(
      description = "Number of responses for each option, corresponding to the options array by index",
      example = "[245, 892, 1456, 2103]",
      requiredMode = Schema.RequiredMode.REQUIRED
  )
  private List<Long> responseCounts;

  @Schema(
      description = "Total number of responses across all options",
      example = "4696",
      minimum = "0"
  )
  private Long totalResponses;


  public PollContent(Long id, String title, String context, List<String> options,
      List<Long> responseCounts, Long totalResponses) {
    super(id, "poll");
    this.title = title;
    this.context = context;
    this.options = options;
    this.responseCounts = responseCounts;
    this.totalResponses = totalResponses;
  }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getContext() { return context; }
  public void setContext(String context) { this.context = context; }

  public List<String> getOptions() {
    return options;
  }

  public List<Long> getResponseCounts() {
    return responseCounts;
  }

  public Long getTotalResponses() {
    return totalResponses;
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

}
