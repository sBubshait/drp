package com.imperial.drp36.model;

import com.imperial.drp36.entity.Annotation;
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

  public InfoContent(Long id, String body, List<Annotation> annotations) {
    super(id, "info");
    this.body = body;
    this.annotations = annotations;
  }

  @Schema(
      description = "List of all annotations for this information segment, ordered by creation time (oldest first)",
      requiredMode = Schema.RequiredMode.REQUIRED
  )
  private List<Annotation> annotations;

  // Getters
  public String getBody() {
    return body;
  }
  public void setBody(String body) {
    this.body = body;
  }

  public List<Annotation> getAnnotations() {
    return annotations;
  }

  public void setAnnotations(List<Annotation> annotations) {
    this.annotations = annotations;
  }
}
