package com.netquest.domain.pointsearntransaction.service;

import com.netquest.domain.pointsearntransaction.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface PointsEarnTransactionService {
    PointsEarnTransactionDto savePointsEarnTransactionByVisit(PointsEarnTransactionCreateByVisitDto pointsEarnTransactionCreateByVisitDto);

    PointsEarnTransactionDto savePointsEarnTransactionByWifiSpotCreation(PointsEarnTransactionCreateByWifiSpotCreationDto pointsEarnTransactionCreateByWifiSpotCreationDto);

    Page<LeaderboardEntryDto> getLeaderboard(Pageable pageable);

    Page<PointsEarnTransactionDetailedDto> getPointsEarnTransactionsByUserId(UUID userUUID, Pageable pageable);

    Long getTotalPointsEarnTransactionByUserId(UUID userUUID);
}
