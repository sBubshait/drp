package com.imperial.drp36.services;

import com.imperial.drp36.entity.DiscussionResponse;
import com.imperial.drp36.entity.Discussion;
import com.imperial.drp36.repository.DiscussionRepository;
import com.imperial.drp36.repository.DiscussionResponseRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class DiscussionService {

  @Autowired
  private DiscussionRepository discussionRepository;

  @Autowired
  private DiscussionResponseRepository discussionResponseRepository;

  public Discussion createDiscussion(String title, String context, String prompt) {
    Discussion discussion = new Discussion(context, prompt);
    return discussionRepository.save(discussion);
  }

  public List<DiscussionResponse> getDiscussionResponses(Long discussionId) {
    return discussionResponseRepository.findByDiscussionIdOrderByCreatedAtAsc(discussionId);
  }

  public DiscussionResponse addResponse(Long discussionId, String responseText) {
    Discussion discussion = discussionRepository.findById(discussionId)
        .orElseThrow(() -> new RuntimeException("Discussion not found"));

    DiscussionResponse response = new DiscussionResponse(discussionId, responseText);
    DiscussionResponse savedResponse = discussionResponseRepository.save(response);

    Long totalResponses = discussionResponseRepository.countByDiscussionId(discussionId);
    discussion.setTotalResponses(totalResponses);
    discussionRepository.save(discussion);

    return savedResponse;
  }

  public Discussion getDiscussionById(Long id) {
    return discussionRepository.findById(id).orElse(null);
  }

  public boolean hasUserResponded(Long discussionId, String author) {
    return discussionResponseRepository.existsById(discussionId);
  }
}
