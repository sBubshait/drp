package com.imperial.drp36.services;

import com.imperial.drp36.entity.Article;
import com.imperial.drp36.entity.Discussion;
import com.imperial.drp36.entity.Question;
import com.imperial.drp36.entity.Info;
import com.imperial.drp36.entity.Segment;
import com.imperial.drp36.entity.Poll;
import com.imperial.drp36.entity.GapFill;
import com.imperial.drp36.entity.Source;
import com.imperial.drp36.model.ArticleContent;
import com.imperial.drp36.model.DiscussionContent;
import com.imperial.drp36.model.GapFillContent;
import com.imperial.drp36.model.PollContent;
import com.imperial.drp36.model.QuestionContent;
import com.imperial.drp36.model.InfoContent;
import com.imperial.drp36.model.SegmentContent;
import com.imperial.drp36.model.SourceContent;
import com.imperial.drp36.repository.*;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.*;

@Service
@Transactional
public class ArticleService {
  @Autowired
  private ArticleRepository articleRepository;

  @Autowired
  private SegmentRepository segmentRepository;

  @Autowired
  private QuestionRepository questionRepository;

  @Autowired
  private PollRepository pollRepository;

  @Autowired
  private DiscussionRepository discussionRepository;

  @Autowired
  private InfoRepository infoRepository;

  @Autowired
  private AnnotationRepository annotationRepository;

  @Autowired
  private GapFillRepository gapFillRepository;

  @Autowired
  private SourceRepository sourceRepository;

  public Article getArticleById(Long id) {
    return articleRepository.findById(id).orElse(null);
  }

  public long getTotalArticleCount() {
    return articleRepository.count();
  }

  public ArticleContent getArticleContent(Article article) {
    if (article == null) {
      return null;
    }

    List<SegmentContent> segmentContents = new ArrayList<>();

    for (Long segmentId : article.getSegments()) {
      Segment segment = segmentRepository.findById(segmentId).orElse(null);
      if (segment != null) {
        SegmentContent segmentContent = getSegmentContent(segment);
        if (segmentContent != null) {
          segmentContents.add(segmentContent);
        }
      }
    }

    return new ArticleContent(
        article.getId(),
        article.getType(),
        article.getContent(),
        article.getCategory(),
        article.getDateCreated(),
        article.getTotalInteractions(),
        segmentContents
    );
  }

  public List<ArticleContent> getAllArticles() {
    List<Article> articles = articleRepository.findAllByOrderByDateCreatedDesc();
    List<ArticleContent> articleContents = new ArrayList<>();

    for (Article article : articles) {
      ArticleContent content = getArticleContent(article);
      if (content != null) {
        articleContents.add(content);
      }
    }

    return articleContents;
  }

  public SegmentContent getSegmentContent(Segment segment) {
    switch (segment.getType()) {
      case "question":
        Question question = questionRepository.findById(segment.getId()).orElse(null);
        if (question != null) {
          return new QuestionContent(
              question.getId(),
              question.getTitle(),
              question.getContext(),
              question.getOptions(),
              question.getCorrectAnswerIndex(),
              question.getHasCorrectAnswer(),
              question.getCorrectFeedback(),
              question.getIncorrectFeedback(),
              question.getGeneralAnswer()
          );
        }
        break;

      case "poll":
        Poll poll = pollRepository.findById(segment.getId()).orElse(null);
        if (poll != null) {
          return new PollContent(
              poll.getId(),
              poll.getTitle(),
              poll.getContext(),
              poll.getOptions(),
              poll.getResponseCounts(),
              poll.getTotalResponses()
          );
        }
        break;

      case "discussion":
        Discussion discussion = discussionRepository.findById(segment.getId()).orElse(null);
        if (discussion != null) {
          return new DiscussionContent(
              discussion.getId(),
              discussion.getContext(),
              discussion.getPrompt(),
              discussion.getTotalResponses()
          );
        }
        break;

      case "info":
        Info info = infoRepository.findById(segment.getId()).orElse(null);
        if (info != null) {
          return new InfoContent(
            info.getId(),
            info.getBody(),
            annotationRepository.findByInfoIdOrderByCreatedAtAsc(segment.getId())
          );
        }
        break;

      case "gap_fill":
        GapFill gapFill = gapFillRepository.findById(segment.getId()).orElse(null);
        if (gapFill != null) {
          return new GapFillContent(
              gapFill.getId(),
              gapFill.getTitle(),
              gapFill.getContext(),
              gapFill.getOptions(),
              gapFill.getCorrectOptions(),
              gapFill.getGapCount(),
              gapFill.getFeedback()
          );
        }
    }
    return null;
  }

  public boolean voteOnPoll(Long pollId, Integer optionIndex) {
    try {
      Poll poll = pollRepository.findById(pollId).orElse(null);
      if (poll == null) {
        return false;
      }

      if (optionIndex < 0 || optionIndex >= poll.getOptions().size()) {
        return false;
      }

      poll.addResponse(optionIndex);
      pollRepository.save(poll);
      return true;
    } catch (Exception e) {
      System.err.println("Error voting on poll: " + e.getMessage());
      return false;
    }
  }

  public List<SourceContent> getSourcesForSegment(Long segmentId) {
    List<Source> sources = sourceRepository.findBySegmentId(segmentId);
    List<SourceContent> sourceContents = new ArrayList<>();

    for (Source source : sources) {
      sourceContents.add(new SourceContent(
          source.getId(),
          source.getTitle(),
          source.getOutletName(),
          source.getOutletShortcode(),
          source.getOutletDomain(),
          source.getUrl(),
          source.getTag()
      ));
    }

    return sourceContents;
  }

  public void incrementArticleInteractions(Long segmentId) {
    // Find the article that contains this segment
    Article article = articleRepository.findBySegmentsContaining(segmentId);
    if (article != null) {
      article.incrementInteractions();
      articleRepository.save(article);
    }
  }
}
