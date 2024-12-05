package com.netquest.pointsearntransaction.unit;

import com.netquest.domain.pointsearntransaction.exception.PointsEarnTransactionAmountNegativeException;
import com.netquest.domain.pointsearntransaction.model.PointsEarnTransaction;
import com.netquest.domain.user.model.UserId;
import com.netquest.domain.wifispot.model.WifiSpotId;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisitId;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowableOfType;

public class PointsEarnTransactionTest {

    @Test
    public void pointsEarnTransactionGoodTest() {
        UserId userId = new UserId();
        WifiSpotVisitId wifiSpotVisitId = new WifiSpotVisitId();
        int minutes = 60;

        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start = end.minusMinutes(minutes);

        LocalDateTime now = LocalDateTime.now();
        PointsEarnTransaction pointsEarnTransaction = new PointsEarnTransaction(userId, wifiSpotVisitId, start, end);
        LocalDateTime now2 = LocalDateTime.now();

        int multiplier = pointsEarnTransaction.getMinutePointsMultiplier();

        assertThat(pointsEarnTransaction.getUserId()).isEqualTo(userId);
        assertThat(pointsEarnTransaction.getWifiSpotVisitId()).isEqualTo(wifiSpotVisitId);
        assertThat(pointsEarnTransaction.getPointsEarnTransactionAmount().getValue()).isEqualTo((long) multiplier * minutes);
        assertThat(pointsEarnTransaction.getPointsEarnTransactionDateTime().getValue()).isBetween(now, now2);

    }

    @Test
    public void pointsEarnTransactionNoPointsTest() {
        UserId userId = new UserId();
        WifiSpotVisitId wifiSpotVisitId = new WifiSpotVisitId();
        int minutes = 60;

        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start = end.minusMinutes(minutes);
        PointsEarnTransactionAmountNegativeException exception = catchThrowableOfType(
                () ->
                        new PointsEarnTransaction(userId, wifiSpotVisitId, end, start),
                PointsEarnTransactionAmountNegativeException.class
        );
        assertThat(exception.getMessage()).isNotEmpty();
    }

    @Test
    public void pointsEarnTransactionNullTest() {
        NullPointerException exception = catchThrowableOfType(
                () ->
                        new PointsEarnTransaction(null, null, null, null),
                NullPointerException.class
        );

        assertThat(exception.getMessage()).isNotEmpty();


    }


    @Test
    public void pointsEarnTransactionByWifiSpotCreation() {
        UserId userId = new UserId();
        WifiSpotId wifiSpotId = new WifiSpotId();
        PointsEarnTransaction pointsEarnTransaction = new PointsEarnTransaction(userId, wifiSpotId);

        assertThat(pointsEarnTransaction.getUserId()).isEqualTo(userId);
        assertThat(pointsEarnTransaction.getWifiSpotId()).isEqualTo(wifiSpotId);
        assertThat(pointsEarnTransaction.getPointsEarnTransactionAmount().getValue()).isEqualTo(600);
    }

}
