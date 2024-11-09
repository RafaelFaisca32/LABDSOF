package com.netquest.domain.pointsearntransaction.mapper.impl;

import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionCreateByVisitDto;
import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionDto;
import com.netquest.domain.pointsearntransaction.mapper.PointsEarnTransactionMapper;
import com.netquest.domain.pointsearntransaction.model.PointsEarnTransaction;
import com.netquest.domain.user.model.UserId;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisitId;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PointsEarnTransactionMapperImpl implements PointsEarnTransactionMapper {
    @Override
    public PointsEarnTransactionDto toDto(PointsEarnTransaction pointsEarnTransaction) {
        return new PointsEarnTransactionDto(
                pointsEarnTransaction.getPointsEarnTransactionId().getValue(),
                pointsEarnTransaction.getPointsEarnTransactionDateTime().getValue(),
                pointsEarnTransaction.getPointsEarnTransactionAmount().getValue());
    }

    @Override
    public PointsEarnTransaction toNewEntityByVisit(PointsEarnTransactionCreateByVisitDto pointsEarnTransactionCreateByVisitDto) {
        return new PointsEarnTransaction(
                new UserId(pointsEarnTransactionCreateByVisitDto.getUserId()),
                new WifiSpotVisitId(pointsEarnTransactionCreateByVisitDto.getWifiSpotVisitId()),
                pointsEarnTransactionCreateByVisitDto.getStartDateTime(),
                pointsEarnTransactionCreateByVisitDto.getEndDateTime()
        );
    }
}
