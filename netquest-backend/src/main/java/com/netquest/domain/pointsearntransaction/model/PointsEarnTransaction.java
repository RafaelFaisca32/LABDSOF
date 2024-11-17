package com.netquest.domain.pointsearntransaction.model;


import com.netquest.domain.user.model.User;
import com.netquest.domain.user.model.UserId;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisit;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisitId;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "points_earn_transaction")
public class PointsEarnTransaction {

    private static final int MINUTE_POINTS_MULTIPLIER = 5;

    @EmbeddedId
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "points_earn_transaction_id"))
    })
    private PointsEarnTransactionId pointsEarnTransactionId;

    @Embedded
    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
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

    @Embedded
    @NotNull
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "points_earn_transaction_user_id"))
    })
    private UserId userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "points_earn_transaction_user_id", insertable = false, updatable = false)
    private User user;


    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "points_earn_transaction_wifi_spot_visit_id"))
    })
    private WifiSpotVisitId wifiSpotVisitId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "points_earn_transaction_wifi_spot_visit_id", insertable = false, updatable = false)
    private WifiSpotVisit wifiSpotVisit;


    public PointsEarnTransaction(
            UserId userId,
            WifiSpotVisitId wifiSpotVisitId,
            @NonNull LocalDateTime start,
            @NonNull LocalDateTime end
    ) {
        this.pointsEarnTransactionId = new PointsEarnTransactionId();
        this.pointsEarnTransactionDateTime = new PointsEarnTransactionDateTime();
        this.pointsEarnTransactionAmount = calculateAmountBasedOnDateTimes(start, end);
        this.userId = new UserId(userId.getValue());
        this.wifiSpotVisitId = new WifiSpotVisitId(wifiSpotVisitId.getValue());
    }

    public int getMinutePointsMultiplier(){
        return MINUTE_POINTS_MULTIPLIER;
    }

    private PointsEarnTransactionAmount calculateAmountBasedOnDateTimes(LocalDateTime start, LocalDateTime end){
        long minutes = ChronoUnit.MINUTES.between(start, end);
        return new PointsEarnTransactionAmount(minutes * MINUTE_POINTS_MULTIPLIER);
    }

}
