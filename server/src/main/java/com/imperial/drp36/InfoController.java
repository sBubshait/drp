package com.imperial.drp36;

import com.imperial.drp36.entity.Annotation;
import com.imperial.drp36.entity.Discussion;
import com.imperial.drp36.entity.DiscussionResponse;
import com.imperial.drp36.model.DiscussionResponses;
import com.imperial.drp36.model.StatusResponse;
import com.imperial.drp36.repository.AnnotationRepository;
import com.imperial.drp36.services.DiscussionService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/info")
public class InfoController {
  @Autowired
  private AnnotationRepository annotationRepository;

  @Tag(name = "Info")
  @PostMapping("/upvote")
  public ResponseEntity<StatusResponse> upvoteAnnotation(@RequestParam Long annotationId) {
    try {
      Optional<Annotation> annotationOpt = annotationRepository.findById(annotationId);

      if (annotationOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
      }

      Annotation annotation = annotationOpt.get();
      annotation.setUpvotes(annotation.getUpvotes() + 1);
      annotationRepository.save(annotation);

      return ResponseEntity.ok().body(
          new StatusResponse(200, "Annotation upvoted successfully")
      );

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(
              new StatusResponse(500, "Error upvoting annotation: " + e.getMessage())
          );
    }
  }
}