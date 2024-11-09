package com.netquest.domain.pointsearntransaction.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "points_earn_transaction")
public class PointsEarnTransaction {

    @EmbeddedId
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "points_earn_transaction_id"))
    })
    private PointsEarnTransactionId pointsEarnTransactionId;

    @Embedded
    @NotNull
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "points_earn_transaction_datetime"))
    })
    private PointsEarnTransactionDateTime pointsEarnTransactionDateTime;

    @Embedded
    @NotNull
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "points_earn_transaction_amount"))
    })
    private PointsEarnTransactionAmount pointsEarnTransactionAmount;

    public PointsEarnTransaction(PointsEarnTransactionAmount pointsEarnTransactionAmount) {
        this.pointsEarnTransactionId = new PointsEarnTransactionId();
        this.pointsEarnTransactionDateTime = new PointsEarnTransactionDateTime();
        this.pointsEarnTransactionAmount = new PointsEarnTransactionAmount(pointsEarnTransactionAmount.getValue());
    }

}
