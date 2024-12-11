package com.netquest.domain.review.service;

import com.netquest.domain.review.dto.ReviewCreateDto;
import com.netquest.domain.review.dto.ReviewDto;

import java.util.UUID;

public interface ReviewService {
    public ReviewDto saveReview(ReviewCreateDto reviewCreateDto, UUID userUUID);
}
