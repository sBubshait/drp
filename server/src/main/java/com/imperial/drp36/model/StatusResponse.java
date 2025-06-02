package com.imperial.drp36.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Standard response object containing status information")
public record StatusResponse(
    @Schema(description = "HTTP status code", example = "200")
    int status,

    @Schema(description = "Status message", example = "API fully operational")
    String message
) { }