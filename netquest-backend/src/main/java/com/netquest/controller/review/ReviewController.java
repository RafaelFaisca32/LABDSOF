package com.netquest.controller.review;

import com.netquest.domain.review.dto.ReviewCreateDto;
import com.netquest.domain.review.dto.ReviewDto;
import com.netquest.domain.review.dto.ReviewHistoryDto;
import com.netquest.domain.review.service.ReviewService;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitHistoryDto;
import com.netquest.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static com.netquest.config.SwaggerConfig.BASIC_AUTH_SECURITY_SCHEME;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/review")
public class ReviewController {
    private final ReviewService reviewService;

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public ReviewDto create(@Valid @RequestBody ReviewCreateDto reviewCreateDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return reviewService.saveReview(reviewCreateDto,userDetails.getId());
    }
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("user-allowed-to-create-review/{wifi-spot-id}")
    public boolean userAllowedToCreateReview(
            @PathVariable(name = "wifi-spot-id") UUID wifiSpotUUID
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return reviewService.userAllowedToCreateReview(userDetails.getId(),wifiSpotUUID);
    }

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/my-reviews")
    public List<ReviewHistoryDto> getMyReviews(
            @RequestParam(required = false) String wifiSpotName,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDateTime endDate
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return reviewService.getMyReviews(userDetails.getId(), wifiSpotName, startDate, endDate);
    }
}
