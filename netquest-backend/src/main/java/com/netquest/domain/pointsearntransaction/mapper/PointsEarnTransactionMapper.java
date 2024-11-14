package com.netquest.domain.pointsearntransaction.mapper;

import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionCreateByVisitDto;
import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionDto;
import com.netquest.domain.pointsearntransaction.model.PointsEarnTransaction;

import java.time.LocalDateTime;

public interface PointsEarnTransactionMapper {
    PointsEarnTransactionDto toDto(PointsEarnTransaction pointsEarnTransaction);
    PointsEarnTransaction toNewEntityByVisit(PointsEarnTransactionCreateByVisitDto pointsEarnTransactionCreateByVisitDto);
}
