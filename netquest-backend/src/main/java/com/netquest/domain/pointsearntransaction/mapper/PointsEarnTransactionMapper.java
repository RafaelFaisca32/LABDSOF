package com.netquest.domain.pointsearntransaction.mapper;

import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionCreateByVisitDto;
import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionCreateByWifiSpotCreationDto;
import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionDto;
import com.netquest.domain.pointsearntransaction.model.PointsEarnTransaction;

public interface PointsEarnTransactionMapper {
    PointsEarnTransactionDto toDto(PointsEarnTransaction pointsEarnTransaction);
    PointsEarnTransaction toNewEntityByVisit(PointsEarnTransactionCreateByVisitDto pointsEarnTransactionCreateByVisitDto);

    PointsEarnTransaction toNewEntityByWifiSpotCreation(PointsEarnTransactionCreateByWifiSpotCreationDto pointsEarnTransactionCreateByWifiSpotCreationDto);

}
