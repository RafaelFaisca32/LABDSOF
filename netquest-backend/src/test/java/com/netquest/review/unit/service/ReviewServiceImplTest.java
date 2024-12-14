package com.netquest.review.unit.service;

import com.netquest.domain.review.dto.ReviewAttributeClassificationDto;
import com.netquest.domain.review.dto.ReviewDto;
import com.netquest.domain.review.mapper.ReviewMapper;
import com.netquest.domain.review.model.*;
import com.netquest.domain.review.service.impl.ReviewServiceImpl;
import com.netquest.domain.user.exception.UserNotFoundException;
import com.netquest.domain.user.model.User;
import com.netquest.domain.user.model.UserId;
import com.netquest.domain.user.model.Username;
import com.netquest.domain.user.service.UserService;
import com.netquest.domain.wifispot.model.WifiSpotId;
import com.netquest.domain.wifispot.service.impl.WifiSpotServiceImpl;
import com.netquest.infrastructure.review.ReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReviewServiceImplTest {

    @InjectMocks
    private ReviewServiceImpl reviewService;

    @Mock
    private UserService userService;

    @Mock
    private WifiSpotServiceImpl wifiSpotService;

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private ReviewMapper reviewMapper;

    private UUID userUUID;
    private UUID wifiSpotUUID;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userUUID = UUID.randomUUID();
        wifiSpotUUID = UUID.randomUUID();
    }

    @Test
    void testGetReviewOfWifiSpot_UserNotFound() {
        when(userService.existsById(userUUID)).thenReturn(false);

        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () ->
                reviewService.getReviewOfWifiSpot(wifiSpotUUID, userUUID)
        );

        assertEquals("User not found", exception.getMessage());
        verify(userService, times(1)).existsById(userUUID);
        verifyNoInteractions(wifiSpotService, reviewRepository, reviewMapper);
    }

    @Test
    void testGetReviewOfWifiSpot_NoReviews() {
        when(userService.existsById(userUUID)).thenReturn(true);
        when(wifiSpotService.existsById(wifiSpotUUID)).thenReturn(true);
        when(reviewRepository.getReviewsOfWifiSpot(new WifiSpotId(wifiSpotUUID)))
                .thenReturn(Optional.empty());

        List<ReviewDto> result = reviewService.getReviewOfWifiSpot(wifiSpotUUID, userUUID);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(userService, times(1)).existsById(userUUID);
        verify(wifiSpotService, times(1)).existsById(wifiSpotUUID);
        verify(reviewRepository, times(1)).getReviewsOfWifiSpot(new WifiSpotId(wifiSpotUUID));
        verifyNoInteractions(reviewMapper);
    }

    @Test
    void testGetReviewOfWifiSpot_WithReviews() {
        // Create mock Review objects using constructor
        Review review1 = new Review(
                new ReviewId(UUID.randomUUID()),
                new ReviewCreateDateTime(LocalDateTime.now()),
                new ReviewComment("Great WiFi spot!"),
                new ReviewOverallClassification(5),
                List.of(
                        new ReviewAttributeClassification("Speed", "Excellent"),
                        new ReviewAttributeClassification("Environment", "Quiet")
                ),
                new WifiSpotId(wifiSpotUUID),
                new UserId(userUUID)
        );

        Review review2 = new Review(
                new ReviewId(UUID.randomUUID()),
                new ReviewCreateDateTime(LocalDateTime.now().minusDays(1)),
                new ReviewComment("Decent place."),
                new ReviewOverallClassification(4),
                List.of(
                        new ReviewAttributeClassification("Speed", "Good"),
                        new ReviewAttributeClassification("Environment", "Moderate")
                ),
                new WifiSpotId(wifiSpotUUID),
                new UserId(userUUID)
        );

        List<Review> reviews = List.of(review1, review2);

        // Create mock ReviewDto objects
        ReviewDto reviewDto1 = new ReviewDto(
                review1.getReviewId().getValue(),
                review1.getReviewCreateDateTime().getValue(),
                review1.getReviewComment().getValue(),
                review1.getReviewOverallClassification().getValue(),
                review1.getReviewAttributeClassificationList().stream()
                        .map(attr -> new ReviewAttributeClassificationDto(attr.getName(), attr.getValue()))
                        .collect(Collectors.toList()),
                review1.getWifiSpotId().getValue(),
                review1.getUserId().getValue(),
                ""
        );

        ReviewDto reviewDto2 = new ReviewDto(
                review2.getReviewId().getValue(),
                review2.getReviewCreateDateTime().getValue(),
                review2.getReviewComment().getValue(),
                review2.getReviewOverallClassification().getValue(),
                review2.getReviewAttributeClassificationList().stream()
                        .map(attr -> new ReviewAttributeClassificationDto(attr.getName(), attr.getValue()))
                        .collect(Collectors.toList()),
                review2.getWifiSpotId().getValue(),
                review2.getUserId().getValue(),
                ""
        );

        User user = new User();
        user.setUsername(new Username(""));

        // Mock behavior
        when(userService.existsById(userUUID)).thenReturn(true);
        when(userService.getUserById(userUUID)).thenReturn(user);
        when(wifiSpotService.existsById(wifiSpotUUID)).thenReturn(true);
        when(reviewRepository.getReviewsOfWifiSpot(new WifiSpotId(wifiSpotUUID))).thenReturn(Optional.of(reviews));
        when(reviewMapper.toDto(review1)).thenReturn(reviewDto1);
        when(reviewMapper.toDto(review2)).thenReturn(reviewDto2);

        // Call the service method
        List<ReviewDto> result = reviewService.getReviewOfWifiSpot(wifiSpotUUID, userUUID);

        // Assertions
        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.contains(reviewDto1));
        assertTrue(result.contains(reviewDto2));

        // Verify interactions
        verify(userService, times(1)).existsById(userUUID);
        verify(wifiSpotService, times(1)).existsById(wifiSpotUUID);
        verify(reviewRepository, times(1)).getReviewsOfWifiSpot(new WifiSpotId(wifiSpotUUID));
        verify(reviewMapper, times(1)).toDto(review1);
        verify(reviewMapper, times(1)).toDto(review2);
    }

}
