package com.imperial.drp36.repository;

import com.imperial.drp36.entity.UserSegment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSegmentRepository extends JpaRepository<UserSegment, Long> {
  boolean existsByUserIdAndSegmentId(Long userId, Long segmentId);
  Long countByUserIdAndSegmentIdIn(Long userId, List<Long> segmentIds);
}
