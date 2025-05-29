package com.imperial.drp36.repository;

import com.imperial.drp36.entity.FeedItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedItemRepository extends JpaRepository<FeedItem, Long> {

  @Query("SELECT f FROM FeedItem f ORDER BY f.createdAt DESC")
  Page<FeedItem> findAllFeedItems(Pageable pageable);

  @Query("SELECT f FROM FeedItem f WHERE f.itemType = :itemType ORDER BY f.createdAt DESC")
  Page<FeedItem> findByItemType(String itemType, Pageable pageable);

  @Query("SELECT f FROM FeedItem f ORDER BY f.id ASC")
  List<FeedItem> findAllOrderByIdAsc();

  @Query("SELECT f FROM FeedItem f WHERE f.id = :id")
  Optional<FeedItem> findByIdOptional(Long id);
}