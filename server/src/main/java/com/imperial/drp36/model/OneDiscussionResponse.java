package com.imperial.drp36.model;

import com.imperial.drp36.entity.Discussion;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response containing information about a single discussion")
public class OneDiscussionResponse {
  @Schema(
      description = "HTTP status code of the response",
      example = "200",
      requiredMode = Schema.RequiredMode.REQUIRED
  )
  private int status;

  @Schema(
      description = "Human-readable message describing the result of the operation, mainly for errors",
      example = "Discussion retrieved successfully",
      requiredMode = Schema.RequiredMode.REQUIRED
  )
  private String message;

  @Schema(
      description = "The discussion object containing all discussion details",
      requiredMode = Schema.RequiredMode.REQUIRED
  )
  private Discussion discussion;

  public OneDiscussionResponse(int status, String message, Discussion discussion) {
    this.status = status;
    this.message = message;
    this.discussion = discussion;
  }

  // Getters and setters
  public int getStatus() { return status; }
  public void setStatus(int status) { this.status = status; }
  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }
  public Discussion getDiscussion() { return discussion; }
  public void setDiscussion(Discussion discussion) { this.discussion = discussion; }
}