package com.netquest.domain.pointsearntransaction.service;

import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionCreateByVisitDto;
import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionDto;

public interface PointsEarnTransactionService {
    PointsEarnTransactionDto savePointsEarnTransaction(PointsEarnTransactionCreateByVisitDto pointsEarnTransactionCreateByVisitDto);
}
