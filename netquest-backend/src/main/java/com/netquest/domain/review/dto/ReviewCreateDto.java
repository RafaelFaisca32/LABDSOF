package com.netquest.domain.review.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class ReviewCreateDto {
    String reviewComment;
    int reviewOverallClassification;
    List<ReviewAttributeClassificationDto> reviewAttributeClassificationDtoList;
    UUID wifiSpotId;
}
