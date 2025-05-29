package com.imperial.drp36.model;

import com.imperial.drp36.entity.Question;
import java.util.List;

public class QuestionContentResponse extends FeedContentResponse {
  private List<String> options;
  private Integer answer;
  private Boolean hasAnswer;
  private String correctAnswerFeedback;
  private String wrongAnswerFeedback;
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

  public static QuestionContentResponse fromQuestion(Question question) {
    return new QuestionContentResponse(
        question.getId(),
        question.getContext(),
        question.getTitle(),
        question.getOptions(),
        question.getCorrectAnswerIndex(),
        question.getHasAnswer(),
        question.getCorrectFeedback(),
        question.getIncorrectFeedback(),
        question.getGeneralAnswer()
    );
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