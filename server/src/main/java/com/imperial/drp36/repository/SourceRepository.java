package com.imperial.drp36.repository;

import com.imperial.drp36.entity.Source;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SourceRepository extends JpaRepository<Source, Long> {
  List<Source> findBySegmentId(Long segmentId);
}