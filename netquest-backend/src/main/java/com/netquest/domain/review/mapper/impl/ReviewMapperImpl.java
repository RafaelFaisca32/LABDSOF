package com.netquest.domain.review.mapper.impl;

import com.netquest.domain.review.dto.ReviewAttributeClassificationDto;
import com.netquest.domain.review.dto.ReviewCreateDto;
import com.netquest.domain.review.dto.ReviewDto;
import com.netquest.domain.review.mapper.ReviewMapper;
import com.netquest.domain.review.model.Review;
import com.netquest.domain.review.model.ReviewAttributeClassification;
import com.netquest.domain.review.model.ReviewComment;
import com.netquest.domain.review.model.ReviewOverallClassification;
import com.netquest.domain.user.model.UserId;
import com.netquest.domain.wifispot.model.WifiSpotId;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ReviewMapperImpl implements ReviewMapper {
    @Override
    public Review toNewEntity(ReviewCreateDto reviewCreateDto, UUID userUUID) {
        return new Review(
                new ReviewComment(reviewCreateDto.getReviewComment()),
                new ReviewOverallClassification(reviewCreateDto.getReviewOverallClassification()),
                reviewCreateDto.getReviewAttributeClassificationDtoList().stream().map(this::toAttributeClassificationEntity).toList(),
                new WifiSpotId(reviewCreateDto.getWifiSpotId()),
                new UserId(userUUID)
        );
    }

    @Override
    public ReviewAttributeClassification toAttributeClassificationEntity(ReviewAttributeClassificationDto reviewAttributeClassificationDto) {
        return new ReviewAttributeClassification(
                reviewAttributeClassificationDto.getName(),
                reviewAttributeClassificationDto.getValue()
        );
    }

    @Override
    public ReviewDto toDto(Review review) {

        String reviewCommentValue = review.getReviewComment() == null ? "" : review.getReviewComment().getValue();

        return new ReviewDto(
                review.getReviewId().getValue(),
                review.getReviewCreateDateTime().getValue(),
                reviewCommentValue,
                review.getReviewOverallClassification().getValue(),
                review.getReviewAttributeClassificationList().stream().map(this::toAttributeClassificationDto).toList(),
                review.getWifiSpotId().getValue(),
                review.getReviewId().getValue()
        );
    }

    @Override
    public ReviewAttributeClassificationDto toAttributeClassificationDto(ReviewAttributeClassification reviewAttributeClassification) {
        return new ReviewAttributeClassificationDto(
                reviewAttributeClassification.getName(),
                reviewAttributeClassification.getValue()
        );
    }


}