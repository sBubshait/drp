package com.imperial.drp36.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "info")
@DiscriminatorValue("info")
public class Info extends Segment {

  @Column(name = "body", columnDefinition = "TEXT")
  private String body;

  // Constructors
  public Info() {
    super();
  }

  public Info(String body) {
    super();
    this.body = body;
  }

  // Getters and setters
  public String getBody() {
    return body;
  }

  public void setBody(String body) {
    this.body = body;
  }
}
