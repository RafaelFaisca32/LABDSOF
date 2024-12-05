package com.netquest.domain.pointsearntransaction.mapper.impl;

import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionCreateByVisitDto;
import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionCreateByWifiSpotCreationDto;
import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionDto;
import com.netquest.domain.pointsearntransaction.mapper.PointsEarnTransactionMapper;
import com.netquest.domain.pointsearntransaction.model.PointsEarnTransaction;
import com.netquest.domain.user.model.UserId;
import com.netquest.domain.wifispot.model.WifiSpotId;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisitId;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PointsEarnTransactionMapperImpl implements PointsEarnTransactionMapper {
    @Override
    public PointsEarnTransactionDto toDto(PointsEarnTransaction pointsEarnTransaction) {


        UUID id = pointsEarnTransaction.getPointsEarnTransactionId().getValue();
        LocalDateTime dateTime = pointsEarnTransaction.getPointsEarnTransactionDateTime().getValue();
        long amount = pointsEarnTransaction.getPointsEarnTransactionAmount().getValue();
        UUID userId = pointsEarnTransaction.getUserId().getValue();

        UUID wifiSpotId = pointsEarnTransaction.getWifiSpotId() == null ? null : pointsEarnTransaction.getWifiSpotId().getValue();
        UUID wifiSpotVisitId = pointsEarnTransaction.getWifiSpotVisitId() == null ? null : pointsEarnTransaction.getWifiSpotVisitId().getValue();


        return new PointsEarnTransactionDto(
                id,dateTime,amount,userId,wifiSpotId,wifiSpotVisitId
        );
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

    @Override
    public PointsEarnTransaction toNewEntityByWifiSpotCreation(PointsEarnTransactionCreateByWifiSpotCreationDto pointsEarnTransactionCreateByWifiSpotCreationDto) {
        return new PointsEarnTransaction(
                new UserId(pointsEarnTransactionCreateByWifiSpotCreationDto.getUserId()),
                new WifiSpotId(pointsEarnTransactionCreateByWifiSpotCreationDto.getWifiSpotId())
        );
    }
}
