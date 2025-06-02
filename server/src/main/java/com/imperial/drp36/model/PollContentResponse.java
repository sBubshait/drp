package com.imperial.drp36.model;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;


public class PollContentResponse extends FeedContentResponse {

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

  @Schema(
      description = "Whether users can select multiple options in this poll",
      example = "false"
  )
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
