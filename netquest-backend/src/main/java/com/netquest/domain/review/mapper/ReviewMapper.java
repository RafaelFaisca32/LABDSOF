package com.netquest.domain.review.mapper;

import com.netquest.domain.review.dto.ReviewAttributeClassificationDto;
import com.netquest.domain.review.dto.ReviewCreateDto;
import com.netquest.domain.review.dto.ReviewDto;
import com.netquest.domain.review.model.Review;
import com.netquest.domain.review.model.ReviewAttributeClassification;

import java.util.UUID;

public interface ReviewMapper {
    public Review toNewEntity(ReviewCreateDto reviewCreateDto, UUID userUUID);
    public ReviewAttributeClassification toAttributeClassificationEntity(ReviewAttributeClassificationDto reviewAttributeClassificationDto);
    public ReviewDto toDto(Review review);
    public ReviewAttributeClassificationDto toAttributeClassificationDto(ReviewAttributeClassification reviewAttributeClassification);
}
