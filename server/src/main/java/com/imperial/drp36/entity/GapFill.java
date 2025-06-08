package com.imperial.drp36.entity;


import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "gap_fill")
@DiscriminatorValue("gap_fill")
public class GapFill extends Segment {
  @Column(name = "context", columnDefinition = "TEXT")
  private String context;

  @Column(name = "title", nullable = false)
  private String title;

  @Column(name = "options")
  @JdbcTypeCode(SqlTypes.JSON)
  private List<String> options = new ArrayList<>();

  @Column(name = "correct_options")
  @JdbcTypeCode(SqlTypes.JSON)
  private List<String> correctOptions = new ArrayList<>();

  @Column(name = "gap_count", nullable = false)
  private Integer numberOfGaps;

  @Column(name = "feedback", columnDefinition = "TEXT")
  private String feedback;

  public GapFill() {
    super();
  }

  public GapFill(String context, String title, List<String> options, List<String> correctOptions, Integer numberOfGaps, String feedback) {
    super();
    this.context = context;
    this.title = title;
    this.options = options != null ? new ArrayList<>(options) : new ArrayList<>();
    this.correctOptions = correctOptions != null ? new ArrayList<>(correctOptions) : new ArrayList<>();
    this.numberOfGaps = numberOfGaps;
    this.feedback = feedback;
  }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getContext() { return context; }
  public void setContext(String context) { this.context = context; }

  public List<String> getOptions() { return options; }
  public void setOptions(List<String> options) { this.options = options; }

  public List<String> getCorrectOptions() { return correctOptions; }
  public void setCorrectOptions(List<String> correctOptions) { this.correctOptions = correctOptions; }

  public Integer getGapCount() { return numberOfGaps; }
  public void setGapCount(Integer numberOfGaps) { this.numberOfGaps = numberOfGaps; }

  public String getFeedback() { return feedback; }
  public void setFeedback(String feedback) { this.feedback = feedback; }
}