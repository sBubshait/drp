package com.imperial.drp36.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.imperial.drp36.entity.Poll;
import com.imperial.drp36.entity.Question;
import io.swagger.v3.oas.annotations.media.Schema;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
    @JsonSubTypes.Type(value = QuestionContent.class, name = "question"),
    @JsonSubTypes.Type(value = PollContent.class, name = "poll"),
    @JsonSubTypes.Type(value = DiscussionContent.class, name = "discussion")
})
public abstract class SegmentContent {
  @Schema(description = "Segment ID", example = "1")
  private Long id;

  @Schema(description = "Segment type", example = "question")
  private String type;

  // Constructors
  public SegmentContent() {}

  public SegmentContent(Long id, String type) {
    this.id = id;
    this.type = type;
  }

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getType() { return type; }
  public void setType(String type) { this.type = type; }
}