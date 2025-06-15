package com.imperial.drp36.repository;

import com.imperial.drp36.entity.Article;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

  List<Article> findAllByOrderByDateCreatedDesc();

  @Query("SELECT a FROM Article a JOIN a.segments s WHERE s = :segmentId")
  Article findBySegmentsContaining(@Param("segmentId") Long segmentId);
}