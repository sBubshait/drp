package com.imperial.drp36.repository;

import com.imperial.drp36.entity.Annotation;
import com.imperial.drp36.entity.DiscussionResponse;
import com.imperial.drp36.entity.Info;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InfoRepository extends JpaRepository<Info, Long> {
}
