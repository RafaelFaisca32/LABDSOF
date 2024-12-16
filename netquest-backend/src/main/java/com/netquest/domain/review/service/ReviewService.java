package com.netquest.domain.review.service;

import com.netquest.domain.review.dto.ReviewCreateDto;
import com.netquest.domain.review.dto.ReviewDto;
import com.netquest.domain.review.dto.ReviewHistoryDto;
import com.netquest.domain.wifispot.model.WifiSpotId;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitHistoryDto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ReviewService {
    ReviewDto saveReview(ReviewCreateDto reviewCreateDto, UUID userUUID);

    boolean userAllowedToCreateReview(UUID userUUID, UUID wifiSpotUUID);

    List<ReviewHistoryDto> getMyReviews(UUID userUUID, String wifiSpotName, LocalDateTime startDate, LocalDateTime endDate);
    List<ReviewDto> getReviewOfWifiSpot(UUID wifiSpotId, UUID userUUID);
}
