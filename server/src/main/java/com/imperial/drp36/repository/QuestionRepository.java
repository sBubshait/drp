package com.imperial.drp36.repository;

import com.imperial.drp36.entity.Question;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

  @Query("SELECT q FROM Question q ORDER BY q.createdAt DESC")
  Page<Question> findAllQuestions(Pageable pageable);

  @Query("SELECT q FROM Question q WHERE q.isCorrectable = :correctable")
  List<Question> findByIsCorrectable(Boolean correctable);

  @Query("SELECT q FROM Question q WHERE q.hasAnswer = true")
  List<Question> findQuestionsWithAnswers();

  @Query("SELECT q FROM Question q WHERE q.createdBy = :createdBy ORDER BY q.createdAt DESC")
  List<Question> findByCreatedBy(String createdBy);
}