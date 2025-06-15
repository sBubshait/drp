package com.imperial.drp36.services;

import com.imperial.drp36.entity.*;
import com.imperial.drp36.repository.*;
import com.imperial.drp36.model.InteractedSegmentsResponse;
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

  @Autowired
  private ArticleService articleService;

  @Autowired
  private UserArticleSegmentRepository userArticleSegmentRepository;

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

  public boolean interactWithSegment(Long userId, Long segmentId) {
    if (!userRepository.existsById(userId)) {
      throw new RuntimeException("User not found");
    }

    if (!segmentRepository.existsById(segmentId)) {
      throw new RuntimeException("Segment not found");
    }

    if (userSegmentRepository.existsByUserIdAndSegmentId(userId, segmentId)) {
      return false;
    }

    UserSegment userSegment = new UserSegment(userId, segmentId);
    userSegmentRepository.save(userSegment);
    return true;
  }

  public InteractedSegmentsResponse getInteractedSegments(Long userId, Long articleId) {
      List<UserArticleSegment> segments = userArticleSegmentRepository.findByUserIdAndArticleSegmentArticleIdOrderBySegmentIdAsc(userId, articleId);
      return new InteractedSegmentsResponse(200, "ok", segments.stream().map(it -> it.getSegmentId()).toList());
  }

  public MetricsResponse getEngagementMetrics() {
    List<User> users = userRepository.findAll();
    if (users.isEmpty()) {
      return new MetricsResponse(404, -1.0, "No users found");
    }

    double totalEDI = 0.0;
    int usersWithData = 0;

    for (User user : users) {
      List<UserArticle> userArticles = userArticleRepository.findByUserId(user.getId());

      if (!userArticles.isEmpty()) {
        double userTotalPercentage = 0.0;
        int articlesProcessed = 0;

        for (UserArticle userArticle : userArticles) {
          Article article = articleService.getArticleById(userArticle.getArticleId());
          if (article != null) {
            List<Long> segmentIds = article.getSegments();
            if (segmentIds.size() > 0) {
              long interactedSegments = userSegmentRepository.countByUserIdAndSegmentIdIn(user.getId(), segmentIds);
              double articlePercentage = (interactedSegments * 100.0) / segmentIds.size();
              userTotalPercentage += articlePercentage;
              articlesProcessed++;
            }
          }
        }

        if (articlesProcessed > 0) {
          double userEDI = userTotalPercentage / articlesProcessed;
          totalEDI += userEDI;
          usersWithData++;
        }
      }
    }

    if (usersWithData == 0) {
      return new MetricsResponse(200, -1.0, "No engagement data available");
    }

    Double averageEDI = totalEDI / usersWithData;
    return new MetricsResponse(200, averageEDI);
  }
}
