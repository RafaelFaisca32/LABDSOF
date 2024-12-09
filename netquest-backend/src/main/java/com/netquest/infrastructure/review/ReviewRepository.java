package com.netquest.infrastructure.review;

import com.netquest.domain.review.model.Review;
import com.netquest.domain.review.model.ReviewId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, ReviewId> {
}
