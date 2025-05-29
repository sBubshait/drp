package com.imperial.drp36.services;

import com.imperial.drp36.entity.FeedItem;
import com.imperial.drp36.model.FeedContentResponse;
import com.imperial.drp36.model.QuestionContentResponse;
import com.imperial.drp36.repository.FeedItemRepository;
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
  private QuestionRepository questionRepository;

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
        return questionRepository.findById(feedItem.getId())
          .map(question -> new QuestionContentResponse(
            question.getId(),
            question.getContext(),
            question.getTitle(),
            question.getOptions(),
            question.getCorrectAnswerIndex(),
            question.getIsCorrectable(),
            question.getCorrectFeedback(),
            question.getIncorrectFeedback(),
            question.getGeneralAnswer()
          )).orElse(null);

      default:
        return null; // or throw an exception if item type is unknown
    }
  }
}