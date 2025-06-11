package com.imperial.drp36.repository;

import com.imperial.drp36.entity.GapFill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GapFillRepository extends JpaRepository<GapFill, Long> {
}