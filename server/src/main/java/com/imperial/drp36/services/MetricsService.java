package com.imperial.drp36.services;

import com.imperial.drp36.entity.Article;
import com.imperial.drp36.entity.User;
import com.imperial.drp36.entity.UserArticle;
import com.imperial.drp36.entity.UserSegment;
import com.imperial.drp36.repository.ArticleRepository;
import com.imperial.drp36.repository.SegmentRepository;
import com.imperial.drp36.repository.UserArticleRepository;
import com.imperial.drp36.repository.UserRepository;
import com.imperial.drp36.repository.UserSegmentRepository;
import com.imperial.drp36.model.MetricsResponse;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
@Transactional
public class MetricsService {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private UserArticleRepository userArticleRepository;

  @Autowired
  private UserSegmentRepository userSegmentRepository;

  @Autowired
  private ArticleRepository articleRepository;

  @Autowired
  private SegmentRepository segmentRepository;

  private ArticleService articleService = new ArticleService();

  public User createUser() {
    User user = new User();
    return userRepository.save(user);
  }

  public void swipeRight(Long userId, Long articleId) {
    if (!userRepository.existsById(userId)) {
      throw new RuntimeException("User not found");
    }

    if (!articleRepository.existsById(articleId)) {
      throw new RuntimeException("Article not found");
    }

    if (userArticleRepository.existsByUserIdAndArticleId(userId, articleId)) {
      return;
    }

    UserArticle userArticle = new UserArticle(userId, articleId);
    userArticleRepository.save(userArticle);
  }

  public void interactWithSegment(Long userId, Long segmentId) {
    if (!userRepository.existsById(userId)) {
      throw new RuntimeException("User not found");
    }

    if (!segmentRepository.existsById(segmentId)) {
      throw new RuntimeException("Segment not found");
    }

    if (userSegmentRepository.existsByUserIdAndSegmentId(userId, segmentId)) {
      return;
    }

    UserSegment userSegment = new UserSegment(userId, segmentId);
    userSegmentRepository.save(userSegment);
  }

  public MetricsResponse getEngagementMetrics() {
    List<User> users = userRepository.findAll();
    if (users.isEmpty()) {
      return new MetricsResponse(200, 0.0);
    }

    double totalEDI = 0.0;
    int usersWithData = 0;

    for (User user : users) {
      List<UserArticle> userArticles = userArticleRepository.findByUserId(user.getId());

      if (!userArticles.isEmpty()) {
        long totalSegments = 0;
        long interactedSegments = 0;

        for (UserArticle userArticle : userArticles) {
          Article article = articleService.getArticleById(userArticle.getArticleId());
          if (article != null) {
            List<Long> segmentIds = article.getSegments();
            totalSegments += segmentIds.size();

            interactedSegments += userSegmentRepository.countByUserIdAndSegmentIdIn(user.getId(), segmentIds);
          }
        }

        if (totalSegments > 0) {
          double userEDI = (interactedSegments * 100.0) / totalSegments;
          totalEDI += userEDI;
          usersWithData++;
        }
      }
    }

    Double averageEDI = usersWithData > 0 ? totalEDI / usersWithData : -1.0;
    return new MetricsResponse(200, averageEDI);
  }
}