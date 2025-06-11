package com.imperial.drp36.repository;

import com.imperial.drp36.entity.UserArticle;
import com.imperial.drp36.entity.UserArticleSegment;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserArticleSegmentRepository extends JpaRepository<UserArticleSegment, Long> {
  List<UserArticleSegment> findByUserIdAndArticleSegmentArticleId (Long userId, Long articleId);
}
