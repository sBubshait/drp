package com.imperial.drp36.model;

public class SegmentResponse {

  private int status;
  private String message;
  private SegmentContent segment;

  // Constructor for error responses
  public SegmentResponse(int status, String message) {
    this.status = status;
    this.message = message;
    this.segment = null;
  }

  // Constructor for success responses
  public SegmentResponse(int status, SegmentContent segment) {
    this.status = status;
    this.message = "Success";
    this.segment = segment;
  }

  // Getters and setters
  public int getStatus() {
    return status;
  }

  public void setStatus(int status) {
    this.status = status;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public SegmentContent getSegment() {
    return segment;
  }

  public void setSegment(SegmentContent segment) {
    this.segment = segment;
  }
}