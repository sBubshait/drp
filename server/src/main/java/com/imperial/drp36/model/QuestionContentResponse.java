package com.imperial.drp36.model;

import com.imperial.drp36.entity.Question;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;


public class QuestionContentResponse extends FeedContentResponse {
  @Schema(
      description = "List of answer options for the question",
      example = "[\"$5 Billion\", \"$15 Billion\", \"$35 Billion\", \"$53 Billion\"]",
      requiredMode = Schema.RequiredMode.REQUIRED
  )
  private List<String> options;

  @Schema(
      description = "Zero-based index of the correct answer option. Null if question has no definitive answer or is opinion-based",
      example = "3",
      minimum = "0"
  )
  private Integer answer;

  @Schema(
      description = "Indicates whether this question has a definitive correct answer (or is opinion-based)",
      example = "true"
  )
  private Boolean hasAnswer;

  @Schema(
      description = "Feedback message displayed when user selects the correct answer",
      example = "Correct! Harvard's endowment is indeed worth $53 Billion - literally wealthier than half of the countries on earth!"
  )
  private String correctAnswerFeedback;

  @Schema(
      description = "Feedback message displayed when user selects an incorrect answer",
      example = "Not quite... It's actually worth $53 Billion.. literally wealthier than half of the countries on earth!"
  )
  private String wrongAnswerFeedback;

  @Schema(
      description = "General answer for when the question is opinion-based or has no definitive answer, i.e., hasAnswer is false",
      example = "Harvard University's endowment is valued at approximately $53 billion as of 2024, making it the largest university endowment in the world."
  )
  private String generalAnswer;

  public QuestionContentResponse() {
    super();
  }

  public QuestionContentResponse(Long id, String context, String title,
      List<String> options, Integer answer, Boolean hasAnswer,
      String correctAnswerFeedback, String wrongAnswerFeedback,
      String generalAnswer) {
    super(id, context, "question", title);
    this.options = options;
    this.answer = answer;
    this.hasAnswer = hasAnswer;
    this.correctAnswerFeedback = correctAnswerFeedback;
    this.wrongAnswerFeedback = wrongAnswerFeedback;
    this.generalAnswer = generalAnswer;
  }

  // Getters
  public List<String> getOptions() { return options; }
  public Integer getAnswer() { return answer; }
  public Boolean getHasAnswer() { return hasAnswer; }
  public String getCorrectAnswerFeedback() { return correctAnswerFeedback; }
  public String getWrongAnswerFeedback() { return wrongAnswerFeedback; }
  public String getGeneralAnswer() { return generalAnswer; }

  // Setters
  public void setOptions(List<String> options) { this.options = options; }
  public void setAnswer(Integer answer) { this.answer = answer; }
  public void setHasAnswer(Boolean hasAnswer) { this.hasAnswer = hasAnswer; }
  public void setCorrectAnswerFeedback(String correctAnswerFeedback) { this.correctAnswerFeedback = correctAnswerFeedback; }
  public void setWrongAnswerFeedback(String wrongAnswerFeedback) { this.wrongAnswerFeedback = wrongAnswerFeedback; }
  public void setGeneralAnswer(String generalAnswer) { this.generalAnswer = generalAnswer; }
}