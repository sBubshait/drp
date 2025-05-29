package com.imperial.drp36;

import com.imperial.drp36.entity.Question;
import com.imperial.drp36.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class QuestionController {

  @Autowired
  private QuestionRepository questionRepository;

  @GetMapping("/")
  public ResponseEntity<Map<String, Object>> status() {
    Map<String, Object> response = new HashMap<>();
    response.put("status", 200);
    response.put("message", "Question App is running");
    return ResponseEntity.ok(response);
  }

  @GetMapping("/random-question")
  public ResponseEntity<?> getRandomQuestion() {
    Question randomQuestion = questionRepository.findRandomQuestion();
    if (randomQuestion != null) {
      return ResponseEntity.ok(randomQuestion);
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(404, "No questions in the database :("));
    }
  }
}