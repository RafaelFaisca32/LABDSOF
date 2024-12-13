package com.netquest.domain.review.service.impl;

import com.netquest.domain.review.dto.ReviewCreateDto;
import com.netquest.domain.review.dto.ReviewDto;
import com.netquest.domain.review.mapper.ReviewMapper;
import com.netquest.domain.review.model.Review;
import com.netquest.domain.review.service.ReviewService;
import com.netquest.domain.user.exception.UserNotFoundException;
import com.netquest.domain.user.service.UserService;
import com.netquest.domain.wifispot.exception.WifiSpotNotFoundException;
import com.netquest.domain.wifispot.service.WifiSpotService;
import com.netquest.domain.wifispotvisit.service.WifiSpotVisitService;
import com.netquest.infrastructure.review.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@RequiredArgsConstructor
@Service
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final UserService userService;
    private final WifiSpotService wifiSpotService;
    private final WifiSpotVisitService wifiSpotVisitService;

    @Override
    public ReviewDto saveReview(ReviewCreateDto reviewCreateDto, UUID userUUID){
        Review review = reviewMapper.toNewEntity(reviewCreateDto, userUUID);
        if(!userService.existsById(userUUID)){
            throw new UserNotFoundException("User not found");
        }

        if(!wifiSpotService.existsById(reviewCreateDto.getWifiSpotId())){
            throw new WifiSpotNotFoundException("Wifi Spot not found");
        }


        return reviewMapper.toDto(reviewRepository.save(review));
    }

    @Override
    public boolean userAllowedToCreateReview(UUID userUUID, UUID wifiSpotUUID) {
        return wifiSpotVisitService.hasUserVisitedWifiSpotBasedOnMinutes(userUUID,wifiSpotUUID,2);
    }
}
