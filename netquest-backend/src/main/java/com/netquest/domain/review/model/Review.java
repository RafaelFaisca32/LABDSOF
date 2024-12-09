package com.netquest.domain.review.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "review")
public class Review {
    @EmbeddedId
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "review_id"))
    })
    private ReviewId reviewId;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "review_create_date_time"))
    })
    private ReviewCreateDateTime reviewCreateDateTime;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "review_comment"))
    })
    private ReviewComment reviewComment;

    @Embedded
    @NotNull
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "review_overall_classification"))
    })
    private ReviewOverallClassification reviewOverallClassification;

    @ElementCollection
    @CollectionTable(
            name = "review_attribute_classification",
            joinColumns = @JoinColumn(name = "review_id")
    )
    @AttributeOverrides({
            @AttributeOverride(name = "name", column = @Column(name = "review_attribute_classification_name")),
            @AttributeOverride(name = "value", column = @Column(name = "review_attribute_classification_value"))
    })
    private List<ReviewAttributeClassification> reviewAttributeClassificationList;

    public Review(@NonNull ReviewId reviewId, @NonNull ReviewCreateDateTime reviewCreateDateTime,
                  ReviewComment reviewComment, @NonNull ReviewOverallClassification reviewOverallClassification,
                  List<ReviewAttributeClassification> reviewAttributeClassificationList) {
        this.reviewId = new ReviewId(reviewId.getValue());
        this.reviewCreateDateTime = new ReviewCreateDateTime(reviewCreateDateTime.getValue());
        this.reviewComment = (reviewComment != null ?  new ReviewComment(reviewComment.getValue()) : new ReviewComment());
        this.reviewOverallClassification =  new ReviewOverallClassification(reviewOverallClassification.getValue());
        this.reviewAttributeClassificationList = (reviewAttributeClassificationList !=null ? new ArrayList<>(reviewAttributeClassificationList) : new ArrayList<>());
    }

    public Review(ReviewComment reviewComment, @NonNull ReviewOverallClassification reviewOverallClassification,
                  List<ReviewAttributeClassification> reviewAttributeClassificationList){
        this.reviewId = new ReviewId();
        this.reviewCreateDateTime = new ReviewCreateDateTime();
        this.reviewComment = (reviewComment != null ?  new ReviewComment(reviewComment.getValue()) : new ReviewComment());
        this.reviewOverallClassification =  new ReviewOverallClassification(reviewOverallClassification.getValue());
        this.reviewAttributeClassificationList = (reviewAttributeClassificationList !=null ? new ArrayList<>(reviewAttributeClassificationList) : new ArrayList<>());

    }
}
