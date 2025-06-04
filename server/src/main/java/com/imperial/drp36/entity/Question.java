package com.imperial.drp36.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "questions")
@DiscriminatorValue("question")
public class Question extends Segment {

  @Column(name = "title", nullable = false)
  private String title;

  @Column(name = "context", columnDefinition = "TEXT")
  private String context;

  @Column(name = "options")
  @JdbcTypeCode(SqlTypes.JSON)
  private List<String> options = new ArrayList<>();

  @Column(name = "correct_answer_index")
  private Integer correctAnswerIndex;

  @Column(name = "has_correct_answer")
  private Boolean hasCorrectAnswer = false;

  @Column(name = "correct_feedback", columnDefinition = "TEXT")
  private String correctFeedback;

  @Column(name = "incorrect_feedback", columnDefinition = "TEXT")
  private String incorrectFeedback;

  @Column(name = "general_answer", columnDefinition = "TEXT")
  private String generalAnswer;

  // Constructors
  public Question() {
    super();
  }

  public Question(String title, String context, List<String> options, Boolean hasCorrectAnswer) {
    super();
    this.title = title;
    this.context = context;
    this.options = options != null ? new ArrayList<>(options) : new ArrayList<>();
    this.hasCorrectAnswer = hasCorrectAnswer;
  }

  // Getters and Setters
  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getContext() {
    return context;
  }

  public void setContext(String context) {
    this.context = context;
  }

  public List<String> getOptions() {
    return options;
  }

  public void setOptions(List<String> options) {
    this.options = options;
  }

  public Integer getCorrectAnswerIndex() {
    return correctAnswerIndex;
  }

  public void setCorrectAnswerIndex(Integer correctAnswerIndex) {
    this.correctAnswerIndex = correctAnswerIndex;
  }

  public Boolean getHasCorrectAnswer() {
    return hasCorrectAnswer;
  }

  public void setHasCorrectAnswer(Boolean hasCorrectAnswer) {
    this.hasCorrectAnswer = hasCorrectAnswer;
  }

  public String getCorrectFeedback() {
    return correctFeedback;
  }

  public void setCorrectFeedback(String correctFeedback) {
    this.correctFeedback = correctFeedback;
  }

  public String getIncorrectFeedback() {
    return incorrectFeedback;
  }

  public void setIncorrectFeedback(String incorrectFeedback) {
    this.incorrectFeedback = incorrectFeedback;
  }

  public String getGeneralAnswer() {
    return generalAnswer;
  }

  public void setGeneralAnswer(String generalAnswer) {
    this.generalAnswer = generalAnswer;
  }
}