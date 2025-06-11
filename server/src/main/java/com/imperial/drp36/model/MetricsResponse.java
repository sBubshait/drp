package com.imperial.drp36.model;


import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(description = "Engagement metrics response")
public class MetricsResponse {
  @Schema(description = "HTTP status code", example = "200")
  private int status;

  @Schema(description = "Message indicating the status of the request", example = "Success")
  private String message = "Success";

  @Schema(description = "Average Engagement Depth Index across all users", example = "75.5")
  private Double averageEDI;

  @Schema(description= "The time when the metrics were calculated", example = "2023-10-01T12:00:00Z")
  private String timestamp;


  public MetricsResponse(int status, Double averageEDI) {
    this.status = status;
    this.averageEDI = averageEDI;
    this.timestamp = LocalDateTime.now().toString();
  }

  public MetricsResponse(int status, Double averageEDI, String message) {
    this.status = status;
    this.averageEDI = averageEDI;
    this.timestamp = LocalDateTime.now().toString();
    this.message = message;
  }

  public int getStatus() { return status; }
  public void setStatus(int status) { this.status = status; }


  public String getMessage() { return message; }
  public void setMessage(String message) {
    this.message = message;
  }

  public Double getAverageEDI() { return averageEDI; }
  public void setAverageEDI(Double averageEDI) { this.averageEDI = averageEDI; }

  public String getTimestamp() { return timestamp; }
  public void setTimestamp(String timestamp) {
    this.timestamp = timestamp;
  }

}