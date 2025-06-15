package com.imperial.drp36.model;

import com.imperial.drp36.entity.User;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.ArrayList;
import java.util.List;

@Schema(description = "Friends response object")
public class FriendsResponse {
  @Schema(description = "HTTP status code", example = "200")
  private int status;

  @Schema(description = "Response message", example = "Success")
  private String message;

  @Schema(description = "List of friend requests")
  private List<User> requests;

  @Schema(description = "List of accepted friends")
  private List<User> friends;

  public FriendsResponse(int status, String message) {
    this.status = status;
    this.message = message;
    this.requests = new ArrayList<>();
    this.friends = new ArrayList<>();
  }

  public FriendsResponse(int status, String message, List<User> requests, List<User> friends) {
    this.status = status;
    this.message = message;
    this.requests = requests != null ? requests : new ArrayList<>();
    this.friends = friends != null ? friends : new ArrayList<>();
  }

  // Getters and Setters
  public int getStatus() { return status; }
  public void setStatus(int status) { this.status = status; }

  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }

  public List<User> getRequests() { return requests; }
  public void setRequests(List<User> requests) { this.requests = requests; }

  public List<User> getFriends() { return friends; }
  public void setFriends(List<User> friends) { this.friends = friends; }
}