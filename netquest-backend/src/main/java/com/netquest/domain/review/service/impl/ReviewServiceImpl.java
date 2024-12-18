package com.netquest.domain.review.service.impl;

import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionCreateByReviewDto;
import com.netquest.domain.pointsearntransaction.service.PointsEarnTransactionService;
import com.netquest.domain.review.dto.ReviewCreateDto;
import com.netquest.domain.review.dto.ReviewDto;
import com.netquest.domain.review.dto.ReviewHistoryDto;
import com.netquest.domain.review.mapper.ReviewMapper;
import com.netquest.domain.review.model.Review;
import com.netquest.domain.review.service.ReviewService;
import com.netquest.domain.user.exception.UserNotFoundException;
import com.netquest.domain.user.model.User;
import com.netquest.domain.user.model.UserId;
import com.netquest.domain.user.service.UserService;
import com.netquest.domain.wifispot.dto.WifiSpotDto;
import com.netquest.domain.wifispot.exception.WifiSpotNotFoundException;
import com.netquest.domain.wifispot.model.WifiSpotId;
import com.netquest.domain.wifispot.service.WifiSpotService;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitHistoryDto;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisit;
import com.netquest.domain.wifispotvisit.service.WifiSpotVisitService;
import com.netquest.infrastructure.review.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final UserService userService;
    private final WifiSpotService wifiSpotService;
    private final WifiSpotVisitService wifiSpotVisitService;
    private final PointsEarnTransactionService pointsEarnTransactionService;

    @Override
    public ReviewDto saveReview(ReviewCreateDto reviewCreateDto, UUID userUUID){
        Review review = reviewMapper.toNewEntity(reviewCreateDto, userUUID);
        if(!userService.existsById(userUUID)){
            throw new UserNotFoundException("User not found");
        }

        if(!wifiSpotService.existsById(reviewCreateDto.getWifiSpotId())){
            throw new WifiSpotNotFoundException("Wifi Spot not found");
        }

        ReviewDto reviewDto = reviewMapper.toDto(reviewRepository.save(review));
        createPointsEarnTransaction(reviewDto);
        return reviewDto;
    }

    @Override
    public boolean userAllowedToCreateReview(UUID userUUID, UUID wifiSpotUUID) {
        return wifiSpotVisitService.hasUserVisitedWifiSpotBasedOnMinutes(userUUID,wifiSpotUUID,10);
    }

    private void createPointsEarnTransaction(ReviewDto reviewDto){
        PointsEarnTransactionCreateByReviewDto pointsEarnTransactionCreateByReviewDto = new PointsEarnTransactionCreateByReviewDto(
                reviewDto.getUserId(),
                reviewDto.getReviewId(),
                reviewDto.getWifiSpotId()
        );
        pointsEarnTransactionService.savePointsEarnTransactionByReview(pointsEarnTransactionCreateByReviewDto);
    }


    @Override
    public List<ReviewHistoryDto> getMyReviews(UUID userUUID, String wifiSpotName, LocalDateTime startDate, LocalDateTime endDate) {
        List<ReviewHistoryDto> reviewHistoryDtos = new ArrayList<>();
        if(!userService.existsById(userUUID)){
            throw new UserNotFoundException("User not found");
        }
        UserId userId = new UserId(userUUID);
        List<Review> reviews = reviewRepository.getMyReviews(userId, wifiSpotName != null ? "%" + wifiSpotName + "%" : null, startDate, endDate).orElse(new ArrayList<>());
        List<ReviewDto> reviewDtos = reviews.stream().map(reviewMapper::toDto).collect(Collectors.toList());
        for (ReviewDto reviewDto : reviewDtos) {
            WifiSpotDto wifiSpot = wifiSpotService.getWifiSpotById(reviewDto.getWifiSpotId());
            reviewHistoryDtos.add(new ReviewHistoryDto(
                    reviewDto.getReviewId(),
                    reviewDto.getReviewCreateDateTime(),
                    reviewDto.getReviewComment(),
                    reviewDto.getReviewOverallClassification(),
                    reviewDto.getReviewAttributeClassificationDtoList(),
                    wifiSpot,
                    reviewDto.getUserId()
            ));
        }
        return reviewHistoryDtos;
    }

    @Override
    public List<ReviewDto> getReviewOfWifiSpot(UUID wifiSpotId, UUID userUUID) {
        if(!userService.existsById(userUUID)){
            throw new UserNotFoundException("User not found");
        }
        if(!wifiSpotService.existsById(wifiSpotId)){
            throw new WifiSpotNotFoundException("Wifi Spot not found");
        }
        WifiSpotId wifiSpotId1 = new WifiSpotId(wifiSpotId);
        List<Review> reviews = reviewRepository.getReviewsOfWifiSpot(wifiSpotId1).orElse(new ArrayList<>());
        List<ReviewDto> reviewDtos = reviews.stream().map(reviewMapper::toDto).collect(Collectors.toList());
        for (ReviewDto reviewDto: reviewDtos) {
            User user = userService.getUserById(reviewDto.getUserId());
            reviewDto.setUsername(user.getUsername().getUserName());
        }

        return reviewDtos;
    }
}
