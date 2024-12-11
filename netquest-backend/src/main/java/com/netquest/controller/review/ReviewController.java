package com.netquest.controller.review;

import com.netquest.domain.review.dto.ReviewCreateDto;
import com.netquest.domain.review.dto.ReviewDto;
import com.netquest.domain.review.service.ReviewService;
import com.netquest.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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
}
