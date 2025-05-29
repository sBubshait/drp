package com.imperial.drp36.repository;

import com.imperial.drp36.entity.Poll;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {
  @Query("SELECT p FROM Poll p ORDER BY p.createdAt DESC")
  Page<Poll> findAllPolls(Pageable pageable);
}
