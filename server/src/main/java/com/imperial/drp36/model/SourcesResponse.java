package com.imperial.drp36.model;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.ArrayList;
import java.util.List;

@Schema(description = "Response object for sources")
public class SourcesResponse {
  @Schema(description = "HTTP status code", example = "200")
  private int status;

  @Schema(description = "List of sources for the segment")
  private List<SourceContent> sources;

  // Constructors
  public SourcesResponse(int status) {
    this.status = status;
    this.sources = new ArrayList<>();
  }

  public SourcesResponse(int status, List<SourceContent> sources) {
    this.status = status;
    this.sources = sources != null ? sources : new ArrayList<>();
  }

  // Getters and Setters
  public int getStatus() { return status; }
  public void setStatus(int status) { this.status = status; }

  public List<SourceContent> getSources() { return sources; }
  public void setSources(List<SourceContent> sources) { this.sources = sources; }
}