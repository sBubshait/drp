package com.imperial.drp36.model;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

public class GapFillContent extends SegmentContent {
  @Schema(description = "Gap Fill question title", required = true, example = "e.g., In the context of economic policy, the government aims to control __________ and stimulate __________.")
  private String title;

  @Schema(description = "Context / background for the gap fill exercise", example = "Economic policy is a government's strategy to manage the economy, including measure for inflation, unemployment, and growth.")
  private String context;

  @Schema(description = "Available options for filling the gaps", required = true, example = "[\"inflation\", \"recession\", \"growth\", \"unemployment\"]")
  private List<String> options;

  @Schema(description = "Correct options that fill the gaps. Must fill in all gaps (ie size == gapCount)", required = true, example = "[\"inflation\", \"growth\"]")
  private List<String> correctOptions;

  @Schema(description = "Number of gaps that need to be filled", required = true, minimum = "1", example = "2")
  private Integer gapCount;

  @Schema(description = "Optional feedback message displayed when the user fills the gaps correctly", example = "Exactly! The government aims to control inflation and stimulate growth.")
  private String feedback;

  public GapFillContent() {
    super();
  }

  public GapFillContent(Long id, String title, String context, List<String> options, List<String> correctOptions,
      Integer gapCount, String feedback) {
    super(id, "gap_fill");
    this.title = title;
    this.context = context;
    this.options = options;
    this.correctOptions = correctOptions;
    this.gapCount = gapCount;
    this.feedback = feedback;
  }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getContext() { return context; }
  public void setContext(String context) { this.context = context; }

  public List<String> getOptions() { return options; }
  public void setOptions(List<String> options) { this.options = options; }

  public List<String> getCorrectOptions() { return correctOptions; }
  public void setCorrectOptions(List<String> correctOptions) { this.correctOptions = correctOptions; }

  public Integer getGapCount() { return gapCount; }
  public void setGapCount(Integer gapCount) { this.gapCount = gapCount; }

  public String getFeedback() { return feedback; }
  public void setFeedback(String feedback) { this.feedback = feedback; }
}
