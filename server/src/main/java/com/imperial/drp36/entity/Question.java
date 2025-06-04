package com.imperial.drp36.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "questions")
@DiscriminatorValue("question")
public class Question extends FeedItem {
  @Column(name = "options")
  @JdbcTypeCode(SqlTypes.JSON)
  private List<String> options = new ArrayList<>();

  @Column(name = "correct_answer_index")
  private Integer correctAnswerIndex;

  @Column(name = "is_correctable")
  private Boolean isCorrectable = false;

  @Column(name = "has_answer")
  private Boolean hasAnswer = false;

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

  public Question(String title, String context, String createdBy,
      List<String> options, Boolean isCorrectable) {
    super(title, context, createdBy);
    this.options = options != null ? new ArrayList<>(options) : new ArrayList<>();
    this.isCorrectable = isCorrectable;
  }

  // Getters and Setters
  public List<String> getOptions() { return options; }
  public void setOptions(List<String> options) {
    this.options = options != null ? new ArrayList<>(options) : new ArrayList<>();
  }

  public Integer getCorrectAnswerIndex() { return correctAnswerIndex; }
  public void setCorrectAnswerIndex(Integer correctAnswerIndex) {
    this.correctAnswerIndex = correctAnswerIndex;
  }

  public Boolean getIsCorrectable() { return isCorrectable; }
  public void setIsCorrectable(Boolean isCorrectable) { this.isCorrectable = isCorrectable; }

  public Boolean getHasAnswer() { return hasAnswer; }
  public void setHasAnswer(Boolean hasAnswer) { this.hasAnswer = hasAnswer; }

  public String getCorrectFeedback() { return correctFeedback; }
  public void setCorrectFeedback(String correctFeedback) { this.correctFeedback = correctFeedback; }

  public String getIncorrectFeedback() { return incorrectFeedback; }
  public void setIncorrectFeedback(String incorrectFeedback) { this.incorrectFeedback = incorrectFeedback; }

  public String getGeneralAnswer() { return generalAnswer; }
  public void setGeneralAnswer(String generalAnswer) { this.generalAnswer = generalAnswer; }

  // Helper methods
  public String getCorrectAnswer() {
    if (correctAnswerIndex != null && correctAnswerIndex >= 0 && correctAnswerIndex < options.size()) {
      return options.get(correctAnswerIndex);
    }
    return null;
  }

  public boolean isCorrectAnswer(int index) {
    return correctAnswerIndex != null && correctAnswerIndex.equals(index);
  }

  public void addOption(String option) {
    this.options.add(option);
  }
}