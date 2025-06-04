package com.imperial.drp36.repository;

import com.imperial.drp36.entity.Info;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InfoRepository extends JpaRepository<Info, Long> {

  @Query("SELECT f FROM FeedItem f ORDER BY f.createdAt DESC")
  Page<Info> findAllInfo(Pageable pageable);
}
