package com.netquest.domain.pointsearntransaction.mapper;

import com.netquest.domain.pointsearntransaction.dto.*;
import com.netquest.domain.pointsearntransaction.model.PointsEarnTransaction;

import java.util.UUID;

public interface PointsEarnTransactionMapper {
    PointsEarnTransactionDto toDto(PointsEarnTransaction pointsEarnTransaction);
    PointsEarnTransactionDetailedDto toDetailedDto(PointsEarnTransaction pointsEarnTransaction);
    PointsEarnTransaction toNewEntityByVisit(PointsEarnTransactionCreateByVisitDto pointsEarnTransactionCreateByVisitDto);

    PointsEarnTransaction toNewEntityByWifiSpotCreation(PointsEarnTransactionCreateByWifiSpotCreationDto pointsEarnTransactionCreateByWifiSpotCreationDto);


    PointsEarnTransaction toNewEntityByVisitMySpot(PointsEarnTransactionCreateByVisitMySpotDto pointsEarnTransactionCreateByVisitMySpotDto);
}
