package com.imperial.drp36.entity;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("info")
public class Info extends FeedItem {

  // Constructors
  public Info() {
    super();
  }

  public Info(String title, String context, String createdBy) {
    super(title, context, createdBy);
  }
}
