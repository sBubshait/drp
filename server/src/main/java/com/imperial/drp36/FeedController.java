package com.imperial.drp36;

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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class FeedController {
  @GetMapping("/")
  public ResponseEntity<StatusResponse> getStatus() {
    StatusResponse response = new StatusResponse(200, "API is fully operational");
    return ResponseEntity.ok(response);
  }

  @GetMapping("/getFeed")
  @CrossOrigin(origins = "*")
  public ResponseEntity<FeedResponse> getFeed(@RequestParam(required = false) Long id) {
    if (id == null || id == 1) {
      FeedResponse response = new FeedResponse(
          200,
          1L,
          1L,
          1,
          new QuestionContentResponse(
              1L,
              "context",
              "Sample Question",
              List.of("Option A", "Option B", "Option C"),
              1,
              true,
              "Correct answer feedback",
              "Wrong answer feedback",
              "General answer"
          ),
          LocalDateTime.now().toString(),
          ""
      );

      return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(new FeedResponse(404));
  }
}
