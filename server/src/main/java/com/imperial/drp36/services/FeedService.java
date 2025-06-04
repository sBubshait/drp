package com.imperial.drp36.services;

import com.imperial.drp36.entity.FeedItem;
import com.imperial.drp36.entity.Poll;
import com.imperial.drp36.model.FeedContentResponse;
import com.imperial.drp36.model.QuestionContentResponse;
import com.imperial.drp36.repository.FeedItemRepository;
import com.imperial.drp36.repository.InfoRepository;
import com.imperial.drp36.repository.PollRepository;
import com.imperial.drp36.repository.QuestionRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.*;

@Service
@Transactional
public class FeedService {

  @Autowired
  private FeedItemRepository feedItemRepository;

  @Autowired
  private InfoRepository infoRepository;

  @Autowired
  private QuestionRepository questionRepository;

  @Autowired
  private PollRepository pollRepository;

  public FeedItem getFeedItemById(Long id) {
    return feedItemRepository.findByIdOptional(id).orElse(null);
  }

  public Page<FeedItem> getAllFeedItems(int page, int size) {
    Pageable pageable = PageRequest.of(page, size);
    return feedItemRepository.findAllFeedItems(pageable);
  }

  public List<FeedItem> getAllFeedItemsSequential() {
    return feedItemRepository.findAllOrderByIdAsc();
  }

  public Page<FeedItem> getFeedItemsByType(String itemType, int page, int size) {
    Pageable pageable = PageRequest.of(page, size);
    return feedItemRepository.findByItemType(itemType, pageable);
  }

  public long getTotalFeedItemCount() {
    return feedItemRepository.count();
  }

  public FeedItem saveFeedItem(FeedItem feedItem) {
    return feedItemRepository.save(feedItem);
  }

  public void deleteFeedItem(Long id) {
    feedItemRepository.deleteById(id);
  }

  public boolean feedItemExists(Long id) {
    return feedItemRepository.existsById(id);
  }

  public FeedContentResponse getFeedContentResponse(FeedItem feedItem) {
    switch (feedItem.getItemType()) {
      case "question":
        return FeedContentResponse.fromQuestion(questionRepository.findById(feedItem.getId()).orElse(null));

      case "poll":
        return FeedContentResponse.fromPoll(pollRepository.findById(feedItem.getId()).orElse(null));

      case "info":
        return FeedContentResponse.fromInfo(infoRepository.findById(feedItem.getId()).orElse(null));

      default:
        System.err.println("Unknown item type: " + feedItem.getItemType());
        return null; // or throw an exception if item type is unknown
    }
  }

  public boolean voteOnPoll(Long pollId, Integer optionIndex) {
    try {
      Poll poll = pollRepository.findById(pollId).orElse(null);

      if (poll == null) {
        return false;
      }

      // Validate option index
      if (optionIndex < 0 || optionIndex >= poll.getOptions().size()) {
        return false;
      }

      // Use the existing addResponse method from Poll entity
      poll.addResponse(optionIndex);

      // Save the updated poll
      pollRepository.save(poll);

      return true;
    } catch (Exception e) {
      System.err.println("Error voting on poll: " + e.getMessage());
      return false;
    }
  }
}
