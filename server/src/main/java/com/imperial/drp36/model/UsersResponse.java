package com.imperial.drp36.model;

import com.imperial.drp36.entity.User;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Standard response object containing status information")
public record UsersResponse(
    @Schema(description = "HTTP status code", example = "200")
    int status,

    @Schema(description = "Status message", example = "API fully operational")
    String message,

    List<User> users) {
  public UsersResponse(int status, String message) {
    this(status, message, null);
  }
}
