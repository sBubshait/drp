package com.imperial.drp36.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.imperial.drp36.entity.Poll;
import com.imperial.drp36.entity.Question;
import java.util.Optional;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
    @JsonSubTypes.Type(value = QuestionContentResponse.class, name = "question"),
})
public abstract class FeedContentResponse {
  private Long id;
  private String context;
  private String type;
  private String title;

  public FeedContentResponse() {}

  public FeedContentResponse(Long id, String context, String type, String title) {
    this.id = id;
    this.context = context;
    this.type = type;
    this.title = title;
  }

  // Getters
  public Long getId() { return id; }
  public String getContext() { return context; }
  public String getType() { return type; }
  public String getTitle() { return title; }

  // Setters
  public void setId(Long id) { this.id = id; }
  public void setContext(String context) { this.context = context; }
  public void setType(String type) { this.type = type; }
  public void setTitle(String title) { this.title = title; }


  // factory methods
  public static FeedContentResponse fromQuestion(Question question) {
    if (question == null)
          return null;

    return new QuestionContentResponse(
          question.getId(),
          question.getContext(),
          question.getTitle(),
          question.getOptions(),
          question.getCorrectAnswerIndex(),
          question.getIsCorrectable(),
          question.getCorrectFeedback(),
          question.getIncorrectFeedback(),
          question.getGeneralAnswer()
      );
  }

  public static FeedContentResponse fromPoll(Poll poll) {
    if (poll == null) {
      return null;
    }

    return new PollContentResponse(
        poll.getId(),
        poll.getContext(),
        poll.getTitle(),
        poll.getOptions(),
        poll.getResponseCounts(),
        poll.getTotalResponses(),
        poll.getAllowsMultipleSelection()
    );
  }
}