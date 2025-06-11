package com.imperial.drp36.model;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Standard response object containing status information")
public record InteractedSegmentsResponse(
    @Schema(description = "HTTP status code", example = "200")
    int status,

    @Schema(description = "Status message", example = "API fully operational")
    String message,

    @Schema(description = "List of segments a given user interacted with", example = "[1, 2, 4]")
    List<Long> segments
) {
}
