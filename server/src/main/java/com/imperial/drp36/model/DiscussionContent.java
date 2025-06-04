package com.imperial.drp36.model;

import io.swagger.v3.oas.annotations.media.Schema;

public class DiscussionContent extends SegmentContent {

  @Schema(
      description = "Context or background information for the discussion",
      example = "Trump has been accused of colluding with Russia during the 2016 election."
  )
  private String context;

  @Schema(
      description = "Prompt of the discussion",
      example = "What are your thooughts of countries colluding with other countries to influence elections?",
      requiredMode = Schema.RequiredMode.REQUIRED
  )
  private String prompt;

  @Schema(description = "Total responses")
  private Long totalResponses;

  public DiscussionContent(Long id, String context, String prompt, Long totalResponses) {
    super(id, "discussion");
    this.context = context;
    this.prompt = prompt;
    this.totalResponses = totalResponses;
  }

  public String getContext() {
    return context;
  }

  public void setContext(String context) {
    this.context = context;
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
