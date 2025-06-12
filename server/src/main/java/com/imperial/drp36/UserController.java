package com.imperial.drp36;

import com.imperial.drp36.entity.User;
import com.imperial.drp36.model.IdStatusResponse;
import com.imperial.drp36.model.StatusResponse;
import com.imperial.drp36.repository.UserRepository;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
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

  @Tag(name = "Users")
  @PostMapping("/completeStreak")
  public ResponseEntity<StatusResponse> completeStreak(@RequestParam Long id) {
    try {
      Optional<User> optUser = userRepository.findById(id);
      if (optUser.isPresent()) {
        User user = optUser.get();
        Long streakCond = calcStreakCond(user);
        if (streakCond == 1L) {
          user.setStreak(1);
          user.setLastComplete(LocalDateTime.now());
          userRepository.save(user);
        } else if (streakCond == 2L) {
          user.setStreak(user.getStreak() + 1);
          userRepository.save(user);
        }
        return ResponseEntity.ok(new StatusResponse(200, "Posted completion of streak!"));
      } else {
        return ResponseEntity.notFound().build();
      }
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @Tag(name = "Users")
  @GetMapping("/streakCond")
  public ResponseEntity<IdStatusResponse> getStreakCond(@RequestParam Long id) {
    try {
      Optional<User> optUser = userRepository.findById(id);
      if (optUser.isPresent()) {

        User user = optUser.get();
        Long cond = calcStreakCond(user);

        // User is continuing an existing streak
        if (cond == 2L) {
          return ResponseEntity.ok(new IdStatusResponse(200, "Continuing streak!", cond));

          // User skipped a day, or is a new account! Reset their streak to 0
        } else if (cond == 1L) {
          user.setStreak(0);
          userRepository.save(user);
          return ResponseEntity.ok(new IdStatusResponse(200, "Starting streak!", cond));

          // User already completed streak
        } else {
          return ResponseEntity.ok(new IdStatusResponse(200, "Streak already completed today...", 0L));
        }

      } else {
        return ResponseEntity.notFound().build();
      }
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  // Helper function that retrieves streak condition
  private Long calcStreakCond(User user) {
    LocalDateTime lastComplete = user.getLastComplete();
    LocalDateTime currentTime = LocalDateTime.now();

    // User skipped a day, or is a new account! Reset their streak to 0
    if (lastComplete == null || currentTime.minusDays(1).isAfter(lastComplete)) {
      return 1L;
    }

    // User already completed streak
    if (currentTime.isBefore(lastComplete.plusDays(1))) {
      return 0L;
    }

    // User is continuing an existing streak
    return 2L;
  }
}
