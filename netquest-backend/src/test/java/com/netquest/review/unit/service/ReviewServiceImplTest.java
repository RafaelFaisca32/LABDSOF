package com.netquest.review.unit.service;

import com.netquest.domain.user.model.UserId;
import com.netquest.domain.user.service.UserService;
import com.netquest.domain.wifispot.service.impl.WifiSpotServiceImpl;
import com.netquest.domain.review.dto.ReviewHistoryDto;
import com.netquest.domain.review.mapper.ReviewMapper;
import com.netquest.domain.review.service.impl.ReviewServiceImpl;
import com.netquest.infrastructure.review.ReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

class ReviewServiceImplTest {

    @InjectMocks
    private ReviewServiceImpl ReviewService;

    @Mock
    private UserService userService;

    @Mock
    private ReviewRepository ReviewRepository;

    @Mock
    private ReviewMapper ReviewMapper;

    private UUID userUUID;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userUUID = UUID.randomUUID();
    }

    @Test
    void testGetMyWifiSpotsVisits_NoVisits() {
        when(userService.existsById(userUUID)).thenReturn(true);
        when(ReviewRepository.getMyReviews(new UserId(userUUID), null, null, null))
                .thenReturn(Optional.empty());

        List<ReviewHistoryDto> result = ReviewService.getMyReviews(userUUID, null, null, null);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(userService, times(1)).existsById(userUUID);
        verify(ReviewRepository, times(1)).getMyReviews(new UserId(userUUID), null, null, null);
        verifyNoInteractions(ReviewMapper);
    }
}
