package com.imperial.drp36.repository;

import com.imperial.drp36.entity.Discussion;
import com.imperial.drp36.entity.DiscussionResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DiscussionResponseRepository extends JpaRepository<DiscussionResponse, Long> {
}