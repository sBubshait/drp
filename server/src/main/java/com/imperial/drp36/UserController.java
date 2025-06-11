package com.imperial.drp36;

import com.imperial.drp36.entity.User;
import com.imperial.drp36.model.IdStatusResponse;
import com.imperial.drp36.repository.UserRepository;
import io.swagger.v3.oas.annotations.tags.Tag;

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
@RequestMapping("/users")
public class UserController {

  @Autowired
  private UserRepository userRepository;

  @Tag(name = "Users")
  @PostMapping("/create")
  public ResponseEntity<IdStatusResponse> getUid() {
    try {
      User user = new User(0);
      userRepository.save(user);

      return ResponseEntity.ok(new IdStatusResponse(200, "Successfully generated user id!", user.getId()));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(
            new IdStatusResponse(500, e.getMessage(), 0L)
          );
    }
  }

  @Tag(name = "Users")
  @GetMapping("/get")
  public ResponseEntity<User> getUser(@RequestParam Long id) {
    try {
      Optional<User> user = userRepository.findById(id);
      if (user.isPresent()) {
        return ResponseEntity.ok(user.get());
      } else {
        return ResponseEntity.notFound().build();
      }
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
}
