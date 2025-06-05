package com.imperial.drp36.model;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

public class InfoContent extends SegmentContent {

  @Schema(
      description = "Body of a small paragraph within the article",
      example = "In response to the recent crisis, the government implemented several measures to stabilize the economy.",
      requiredMode = Schema.RequiredMode.REQUIRED
  )
  private String body;

  public InfoContent() {
    super();
  }

  public InfoContent(Long id, String body) {
    super(id, "info");
    this.body = body;
  }

  // Getters
  public String getBody() {
    return body;
  }
  public void setBody(String body) {
    this.body = body;
  }
}
