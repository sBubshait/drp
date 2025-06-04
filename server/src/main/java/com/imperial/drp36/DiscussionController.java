package com.imperial.drp36;

import com.imperial.drp36.entity.Discussion;
import com.imperial.drp36.entity.DiscussionResponse;
import com.imperial.drp36.model.OneDiscussionResponse;
import com.imperial.drp36.model.StatusResponse;
import com.imperial.drp36.services.DiscussionService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/discussions")
public class DiscussionController {
  @Autowired
  private DiscussionService discussionService;

  @Tag(name = "Discussions")
  @PostMapping("/create")
  public ResponseEntity<OneDiscussionResponse> createDiscussion(
      @Parameter(description = "Discussion title", required = true)
      @RequestParam String title,

      @Parameter(description = "Discussion context/description", required = false)
      @RequestParam(required = false) String context,

      @Parameter(description = "Discussion question", required = true)
      @RequestParam String question) {

    try {
      if (title == null || title.trim().isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new OneDiscussionResponse(400, "Title cannot be empty", null));
      }

      if (question == null || question.trim().isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new OneDiscussionResponse(400, "Question cannot be empty", null));
      }

      Discussion discussion = discussionService.createDiscussion(
          title.trim(),
          context != null ? context.trim() : null,
          question.trim()
      );

      return ResponseEntity.ok(
          new OneDiscussionResponse(200, "Discussion created successfully", discussion));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new OneDiscussionResponse(500, "Error creating discussion: " + e.getMessage(),
              null));
    }
  }

  @Tag(name = "Discussions")
  @PostMapping("/respond")
  public ResponseEntity<StatusResponse> respondToDiscussion(
      @Parameter(description = "ID of the discussion", required = true, example = "1")
      @RequestParam Long discussionId,

      @Parameter(description = "Response text", required = true)
      @RequestParam String content) {

    try {
      if (content == null || content.trim().isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new StatusResponse(400, "Response text cannot be empty"));
      }

      DiscussionResponse response = discussionService.addResponse(discussionId, content.trim());

      return ResponseEntity.ok(new StatusResponse(200, "Response added successfully"));
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(new StatusResponse(400, e.getMessage()));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new StatusResponse(500, "Error adding response: " + e.getMessage()));
    }
  }

  @Tag(name = "Discussions")
  @GetMapping("/responses")
  public ResponseEntity<DiscussionResponses> getDiscussionResponses(
      @Parameter(description = "ID of the discussion", required = true, example = "1")
      @RequestParam Long discussionId) {

    try {
      Discussion discussion = discussionService.getDiscussionById(discussionId);
      if (discussion == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new DiscussionResponses(404, "Discussion not found", null, null));
      }

      List<DiscussionResponse> responses = discussionService.getDiscussionResponses(discussionId);

      return ResponseEntity.ok(new DiscussionResponses(
          200,
          "Success",
          discussion,
          responses
      ));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(
              new DiscussionResponses(500, "Error retrieving responses: " + e.getMessage(),
                  null, null));
    }
  }
}