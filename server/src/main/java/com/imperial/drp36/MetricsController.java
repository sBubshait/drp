package com.imperial.drp36;

import com.imperial.drp36.model.MetricsResponse;
import com.imperial.drp36.model.StatusResponse;
import com.imperial.drp36.services.ArticleService;
import com.imperial.drp36.services.MetricsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/metrics")
public class MetricsController {
  @Autowired
  private ArticleService articleService;

  @Autowired
  private MetricsService metricsService;

  @Tag(name = "Metrics")
  @GetMapping("/")
  public ResponseEntity<MetricsResponse> getMetrics() {
    try {
      MetricsResponse metrics = metricsService.getEngagementMetrics();
      return ResponseEntity.ok(metrics);
    } catch (Exception e) {
      System.err.println("Error fetching metrics: " + e.getMessage());
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new MetricsResponse(500, null, "Internal Server Error"));
    }
  }

  @Tag(name = "Metrics")
  @PostMapping("/swipedRight")
  public ResponseEntity<StatusResponse> swipedRight(
      @RequestParam Long userId,
      @RequestParam Long articleId) {

    try {
      metricsService.swipeRight(userId, articleId);
      return ResponseEntity.ok(new StatusResponse(200, "Swipe right recorded successfully"));
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(new StatusResponse(400, e.getMessage()));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new StatusResponse(500, "Error recording swipe: " + e.getMessage()));
    }
  }

  @Tag(name = "Metrics")
  @PostMapping("/interactWithSegment")
  public ResponseEntity<StatusResponse> interactedWith(
      @RequestParam Long userId,
      @RequestParam Long segmentId) {

    try {
      metricsService.interactWithSegment(userId, segmentId);
      return ResponseEntity.ok(new StatusResponse(200, "Segment interaction recorded successfully"));
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(new StatusResponse(400, e.getMessage()));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new StatusResponse(500, "Error recording interaction: " + e.getMessage()));
    }
  }


}
