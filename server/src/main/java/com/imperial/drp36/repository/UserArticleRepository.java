package com.imperial.drp36.repository;

import com.imperial.drp36.entity.UserArticle;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserArticleRepository extends JpaRepository<UserArticle, Long> {
  boolean existsByUserIdAndArticleId(Long userId, Long articleId);
  List<UserArticle> findByUserId(Long userId);
}