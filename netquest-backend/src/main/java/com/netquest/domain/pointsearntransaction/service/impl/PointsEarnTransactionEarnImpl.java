package com.netquest.domain.pointsearntransaction.service.impl;

import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionCreateByVisitDto;
import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionDto;
import com.netquest.domain.pointsearntransaction.mapper.PointsEarnTransactionMapper;
import com.netquest.domain.pointsearntransaction.model.PointsEarnTransaction;
import com.netquest.domain.pointsearntransaction.service.PointsEarnTransactionService;
import com.netquest.infrastructure.pointsearntransaction.PointsEarnTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class PointsEarnTransactionEarnImpl implements PointsEarnTransactionService {
    private final PointsEarnTransactionRepository pointsEarnTransactionRepository;
    private final PointsEarnTransactionMapper pointsEarnTransactionMapper;

    @Override
    public PointsEarnTransactionDto savePointsEarnTransaction(PointsEarnTransactionCreateByVisitDto pointsEarnTransactionCreateByVisitDto) {
        PointsEarnTransaction pointsEarnTransaction = pointsEarnTransactionMapper
                .toNewEntityByVisit(pointsEarnTransactionCreateByVisitDto);

        return pointsEarnTransactionMapper.toDto(pointsEarnTransactionRepository.save(pointsEarnTransaction));
    }
}
