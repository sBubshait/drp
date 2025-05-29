package com.imperial.drp36.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "questions")
public class Question {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 500)
  private String title;

  @Column(columnDefinition = "TEXT")
  private String context;

  @Column(nullable = false, length = 200)
  private String option1;

  @Column(nullable = false, length = 200)
  private String option2;

  @Column(nullable = false, length = 200)
  private String option3;

  @Column(nullable = false, length = 200)
  private String option4;

  // Default constructor
  public Question() {}

  // Constructor
  public Question(String title, String option1, String option2, String option3, String option4, String context) {
    this.title = title;
    this.option1 = option1;
    this.option2 = option2;
    this.option3 = option3;
    this.option4 = option4;
    this.context = context;
  }

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getOption1() { return option1; }
  public void setOption1(String option1) { this.option1 = option1; }

  public String getOption2() { return option2; }
  public void setOption2(String option2) { this.option2 = option2; }

  public String getOption3() { return option3; }
  public void setOption3(String option3) { this.option3 = option3; }

  public String getOption4() { return option4; }
  public void setOption4(String option4) { this.option4 = option4; }

  public String getContext() { return context; }
  public void setContext(String context) { this.context = context; }
}
