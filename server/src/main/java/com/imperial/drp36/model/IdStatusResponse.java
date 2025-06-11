package com.imperial.drp36.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Standard response object containing status information")
public record IdStatusResponse(
    @Schema(description = "HTTP status code", example = "200")
    int status,

    @Schema(description = "Status message", example = "API fully operational")
    String message,

    @Schema(description = "ID of the affected resource", example = "12345")
    Long id
) {
  public IdStatusResponse(int status, String message) {
    this(status, message, null);
  }

}