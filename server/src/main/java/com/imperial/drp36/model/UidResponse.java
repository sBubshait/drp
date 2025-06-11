package com.imperial.drp36.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response object returning user id")
public record UidResponse (
    @Schema(description = "HTTP status code", example = "200")
    int status,

    @Schema(description = "Status message", example = "Successfully generated user id!")
    String message,

    @Schema(description = "User id", example = "9")
    Long id
) { }
