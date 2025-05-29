package com.imperial.drp36;

import com.imperial.drp36.model.FeedContentResponse;
import com.imperial.drp36.services.FeedService;
import com.imperial.drp36.entity.FeedItem;
import com.imperial.drp36.model.FeedResponse;
import com.imperial.drp36.model.QuestionContentResponse;
import com.imperial.drp36.model.StatusResponse;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class FeedController {

@Autowired
  private FeedService feedService;

  @GetMapping("/")
  public ResponseEntity<StatusResponse> getStatus() {
    StatusResponse response = new StatusResponse(200, "API fully operational");
    return ResponseEntity.ok(response);
  }

  @GetMapping("/getFeed")
  public ResponseEntity<FeedResponse> getFeed(@RequestParam(required = false) Long id) {
    // Sequential Scheduler (TODO: Improve as a real scheduler)
    if (id == null)
      id = 1L;
    else if (id < 1)
      id = 1L;
    else if (id > feedService.getTotalFeedItemCount())
      id = feedService.getTotalFeedItemCount() - 1;

    FeedItem feedItem = feedService.getFeedItemById(id);
    System.out.println("Feed item: " + feedItem);
    if (feedItem == null)
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(new FeedResponse(404));

    FeedContentResponse contentResopnse = feedService.getFeedContentResponse(feedItem);
    return ResponseEntity.status(HttpStatus.OK)
        .body(new FeedResponse(
            200,
            id - 1,
            id + 1,
            1,
            contentResopnse,
            feedItem.getCreatedAt().toString(),
            ""
        ));
  }

  @PostMapping("/vote")
  public ResponseEntity<StatusResponse> votePoll(
      @RequestParam Long pollId,
      @RequestParam Integer optionIndex) {

    try {
      boolean success = feedService.voteOnPoll(pollId, optionIndex);

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
