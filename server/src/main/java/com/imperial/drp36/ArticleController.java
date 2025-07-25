package com.imperial.drp36;

import com.imperial.drp36.entity.Article;
import com.imperial.drp36.model.AllArticlesResponse;
import com.imperial.drp36.model.ArticleContent;
import com.imperial.drp36.model.ArticleResponse;
import com.imperial.drp36.model.SegmentContent;
import com.imperial.drp36.model.SegmentResponse;
import com.imperial.drp36.model.SourceContent;
import com.imperial.drp36.model.SourcesResponse;
import com.imperial.drp36.repository.SegmentRepository;
import com.imperial.drp36.services.ArticleService;
import com.imperial.drp36.entity.Segment;
import com.imperial.drp36.model.StatusResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class ArticleController {

@Autowired
  private ArticleService articleService;
@Autowired
  private SegmentRepository segmentRepository;

  @Operation(
      summary = "Check API Status",
      description = "Returns the current status of the API to verify it's operational"
  )
  @ApiResponses(value = {
      @ApiResponse(
          responseCode = "200",
          description = "API is operational",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = StatusResponse.class)
          )
      )
  })

  @Tag(name = "Status")
  @GetMapping("/")
  public ResponseEntity<StatusResponse> getStatus() {
    StatusResponse response = new StatusResponse(200, "API fully operational");
    return ResponseEntity.ok(response);
  }

  @Operation(
      summary = "Get Feed Item",
      description = "Retrieves a feed item by ID. If no ID is provided, returns the first item."
  )
  @ApiResponses(value = {
      @ApiResponse(
          responseCode = "200",
          description = "Feed item retrieved successfully",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = ArticleResponse.class)
          )
      ),
      @ApiResponse(
          responseCode = "404",
          description = "Feed item not found",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = ArticleResponse.class),
              examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                  name = "Not Found Response",
                  value = "{\"status\": 404, \"message\": \"Feed item not found\"}"
          ))
      )
  })

  @Tag(name = "Articles")
  @GetMapping("/getArticle")
  public ResponseEntity<ArticleResponse> getArticle(@RequestParam(required = false) Long id) {
    if (id == null) {
      id = 1L;
    } else if (id < 1) {
      id = 1L;
    } else if (id > articleService.getTotalArticleCount()) {
      id = articleService.getTotalArticleCount();
    }

    Article article = articleService.getArticleById(id);
    if (article == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(new ArticleResponse(404));
    }

    ArticleContent articleContent = articleService.getArticleContent(article);

    return ResponseEntity.ok(new ArticleResponse(
        200,
        id > 1 ? id - 1 : null,
        id < articleService.getTotalArticleCount() ? id + 1 : null,
        articleContent
    ));
  }

  @Tag(name = "Articles")
  @GetMapping("/getSegment")
  public ResponseEntity<SegmentResponse> getSegment(@RequestParam Long segmentId) {
    try {
      Segment segment = segmentRepository.findById(segmentId).orElse(null);

      if (segment == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new SegmentResponse(404, "Segment not found"));
      }

      SegmentContent segmentContent = articleService.getSegmentContent(segment);

      if (segmentContent == null) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new SegmentResponse(500, "Error processing segment content"));
      }

      return ResponseEntity.ok(new SegmentResponse(200, segmentContent));

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new SegmentResponse(500, "Error retrieving segment: " + e.getMessage()));
    }
  }

  @Tag(name = "Articles")
  @GetMapping("/getSources")
  public ResponseEntity<SourcesResponse> getSources(
      @Parameter(
          description = "ID of the segment to get sources for",
          required = true,
          example = "1"
      )
      @RequestParam Long segmentId) {

    try {
      List<SourceContent> sources = articleService.getSourcesForSegment(segmentId);
      return ResponseEntity.ok(new SourcesResponse(200, sources));
    } catch (Exception e) {
      return ResponseEntity.ok(new SourcesResponse(500, new ArrayList<>()));
    }
  }

  @Operation(
      summary = "Get All Articles",
      description = "Retrieves all articles ordered by date created (most recent first)"
  )
  @Tag(name = "Articles")
  @GetMapping("/getAllArticles")
  public ResponseEntity<AllArticlesResponse> getAllArticles() {
    try {
      List<ArticleContent> articles = articleService.getAllArticles();
      long totalCount = articleService.getTotalArticleCount();

      return ResponseEntity.ok(new AllArticlesResponse(200, articles, totalCount));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new AllArticlesResponse(500, "Error retrieving articles: " + e.getMessage()));
    }
  }

  @Operation(
      summary = "Vote on Poll",
      description = "Submit a vote for a specific poll option"
  )
  @ApiResponses(value = {
      @ApiResponse(
          responseCode = "200",
          description = "Vote recorded successfully",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = StatusResponse.class)
          )
      ),
      @ApiResponse(
          responseCode = "404",
          description = "Poll not found or invalid option index",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = StatusResponse.class),
              examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                  value = "{\"status\": 404, \"message\": \"Poll not found or invalid option index\"}"
              )
          )
      )}
  )
  @Tag(name = "Feed")
  @PostMapping("/vote")
  public ResponseEntity<StatusResponse> votePoll(
      @Parameter(
          description = "ID of the poll to vote on",
          required = true,
          example = "1"
      )
      @RequestParam Long pollId,

      @Parameter(
          description = "Index of the option to vote for (0-based)",
          required = true,
          example = "0"
      )
      @RequestParam Integer optionIndex) {

    try {
      boolean success = articleService.voteOnPoll(pollId, optionIndex);

      if (success) {
        return ResponseEntity.ok(new StatusResponse(200, "Vote recorded successfully"));
      } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new StatusResponse(404, "Poll not found or invalid option index"));
      }
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new StatusResponse(500, "Error recording vote: " + e.getMessage()));
    }
  }
}
