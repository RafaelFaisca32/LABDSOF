package com.netquest.domain.pointsearntransaction.mapper.impl;

import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionDto;
import com.netquest.domain.pointsearntransaction.mapper.PointsEarnTransactionMapper;
import com.netquest.domain.pointsearntransaction.model.PointsEarnTransaction;
import org.springframework.stereotype.Service;

@Service
public class PointsEarnTransactionMapperImpl implements PointsEarnTransactionMapper {
    @Override
    public PointsEarnTransactionDto toDto(PointsEarnTransaction pointsEarnTransaction) {
        return new PointsEarnTransactionDto(
                pointsEarnTransaction.getPointsEarnTransactionId().getValue(),
                pointsEarnTransaction.getPointsEarnTransactionDateTime().getValue(),
                pointsEarnTransaction.getPointsEarnTransactionAmount().getValue());
    }
}
