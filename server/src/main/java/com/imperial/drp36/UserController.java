package com.imperial.drp36;

import com.imperial.drp36.entity.User;
import com.imperial.drp36.model.DiscussionResponses;
import com.imperial.drp36.model.StatusResponse;
import com.imperial.drp36.model.UidResponse;
import com.imperial.drp36.repository.UserRepository;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.io.Console;
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
@RequestMapping("/user")
public class UserController {

  @Autowired
  private UserRepository userRepository;

  @Tag(name = "Get UID")
  @PostMapping("/generateUid")
  public ResponseEntity<UidResponse> getUid() {
    try {
      User user = new User(0);
      userRepository.save(user);

      return ResponseEntity.ok(new UidResponse(200, "Successfully generated user id!", user.getId()));

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(
            new UidResponse(500, e.getMessage(), 0L)
          );
    }
  }
}
