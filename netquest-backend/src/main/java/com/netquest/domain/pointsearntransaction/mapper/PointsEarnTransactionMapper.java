package com.netquest.domain.pointsearntransaction.mapper;

import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionDto;
import com.netquest.domain.pointsearntransaction.model.PointsEarnTransaction;

public interface PointsEarnTransactionMapper {
    PointsEarnTransactionDto toDto(PointsEarnTransaction pointsEarnTransaction);
}
