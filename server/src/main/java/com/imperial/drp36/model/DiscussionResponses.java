package com.imperial.drp36.model;

import com.imperial.drp36.entity.Discussion;
import com.imperial.drp36.entity.DiscussionResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Response containing a discussion and all its associated responses")
public class DiscussionResponses {
  @Schema(
      description = "HTTP status code of the response",
      example = "200",
      requiredMode = Schema.RequiredMode.REQUIRED
  )
  private int status;

  @Schema(
      description = "Human-readable message describing the result of the operation",
      example = "Discussion responses retrieved successfully",
      requiredMode = Schema.RequiredMode.REQUIRED
  )
  private String message;

  @Schema(
      description = "The discussion object containing the discussion details",
      requiredMode = Schema.RequiredMode.REQUIRED
  )
  private Discussion discussion;

  @Schema(
      description = "List of all responses submitted to this discussion, ordered by creation time (oldest first)",
      example = "[{\"id\": 1, \"responseText\": \"I think that government funding should be used responsibly...\", \"createdAt\": \"2024-01-15T10:30:00\"}]",
      requiredMode = Schema.RequiredMode.REQUIRED
  )
  private List<DiscussionResponse> responses;


  public DiscussionResponses(int status, String message, Discussion discussion, List<DiscussionResponse> responses) {
    this.status = status;
    this.message = message;
    this.discussion = discussion;
    this.responses = responses;
  }

  // Getters and setters
  public int getStatus() { return status; }
  public void setStatus(int status) { this.status = status; }
  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }
  public Discussion getDiscussion() { return discussion; }
  public void setDiscussion(Discussion discussion) { this.discussion = discussion; }
  public List<DiscussionResponse> getResponses() { return responses; }
  public void setResponses(List<DiscussionResponse> responses) { this.responses = responses; }
}