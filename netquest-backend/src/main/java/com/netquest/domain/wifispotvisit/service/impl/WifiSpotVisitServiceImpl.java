package com.netquest.domain.wifispotvisit.service.impl;

import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionCreateByVisitDto;
import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionDto;
import com.netquest.domain.pointsearntransaction.service.PointsEarnTransactionService;
import com.netquest.domain.user.exception.UserNotFoundException;
import com.netquest.domain.user.model.UserId;
import com.netquest.domain.user.service.UserService;
import com.netquest.domain.wifispot.model.WifiSpotId;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitCreateDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitUpdateDateTimeDto;
import com.netquest.domain.wifispotvisit.exception.*;
import com.netquest.domain.wifispotvisit.mapper.WifiSpotVisitMapper;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisit;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisitEndDateTime;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisitId;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisitStartDateTime;
import com.netquest.domain.wifispotvisit.service.WifiSpotVisitService;
import com.netquest.infrastructure.wifispotvisit.WifiSpotVisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@RequiredArgsConstructor
@Service
public class WifiSpotVisitServiceImpl implements WifiSpotVisitService {
    private final WifiSpotVisitRepository wifiSpotVisitRepository;
    private final WifiSpotVisitMapper wifiSpotVisitMapper;
    private final PointsEarnTransactionService pointsEarnTransactionService;
    private final UserService userService;


    @Override
    public WifiSpotVisitDto saveWifiSpotVisit(UUID userUUID, WifiSpotVisitCreateDto wifiSpotVisitCreateDto) {
        WifiSpotVisit wifiSpotVisit = wifiSpotVisitMapper.toNewEntity(userUUID,wifiSpotVisitCreateDto);


        if(!userService.existsById(userUUID)){
            throw new UserNotFoundException("User not found");
        }
        /*TODO: verify if wifi spot exists
        if(!wifiSpotService.existsById(wifiSpotVisitCreateDto.getWifiSpotId())){
            throw new WifiSpotNotFoundException("Wifi Spot not found")
        }
         */
        UserId userId = new UserId(userUUID);
        if(wifiSpotVisitRepository.existsOnGoingWifiSpotVisitByUserId(userId)){
            throw new WifiSpotVisitOngoingException("Wifi spot visit ongoing for this user");
        }

        if(wifiSpotVisitRepository.existsWifiSpotVisitConflictingIntervalByUserId(
                wifiSpotVisitCreateDto.getStartDateTime(),
                wifiSpotVisitCreateDto.getEndDateTime(),
                userId
        )){
            throw new WifiSpotVisitDatesConflictException("There is a conflict of dates to another visit for this user");
        }

        WifiSpotVisitDto wifiSpotVisitDto = wifiSpotVisitMapper.toDto(wifiSpotVisitRepository.save(wifiSpotVisit));
        createPointsEarnTransactionBasedOnVisit(wifiSpotVisitDto);
        return wifiSpotVisitDto;

    }

    @Override
    public WifiSpotVisitDto updateWifiSpotVisitEndDateTime(UUID userUUID, UUID wifiSpotVisitUUID, WifiSpotVisitUpdateDateTimeDto wifiSpotVisitEndDateTimeDto) {
        WifiSpotVisitId wifiSpotVisitId = new WifiSpotVisitId(wifiSpotVisitUUID);
        UserId userId = new UserId(userUUID);
        WifiSpotVisit wifiSpotVisit = wifiSpotVisitRepository.findByWifiSpotVisitIdAndUserId(wifiSpotVisitId,userId)
                .orElseThrow(() -> new WifiSpotVisitNotFoundException("Wifi spot visit not found"));


        if(wifiSpotVisit.getWifiSpotVisitEndDateTime() != null){
            throw new WifiSpotVisitEndDateTimeAlreadyFilledException("Wifi spot visit end date time already filled");
        }



        WifiSpotVisitEndDateTime wifiSpotVisitEndDateTime = new WifiSpotVisitEndDateTime(wifiSpotVisitEndDateTimeDto.getDateTime());
        wifiSpotVisit.updateEndDateTime(wifiSpotVisitEndDateTime);

        WifiSpotVisitDto wifiSpotVisitDto = wifiSpotVisitMapper.toDto(wifiSpotVisitRepository.save(wifiSpotVisit));
        createPointsEarnTransactionBasedOnVisit(wifiSpotVisitDto);
        return wifiSpotVisitDto;
    }


    private PointsEarnTransactionDto createPointsEarnTransactionBasedOnVisit(WifiSpotVisitDto wifiSpotVisitDto) {
        if(wifiSpotVisitDto.endDateTime() == null) {
            return null;
        }
        return pointsEarnTransactionService.savePointsEarnTransaction(
                new PointsEarnTransactionCreateByVisitDto(
                    wifiSpotVisitDto.startDateTime(), wifiSpotVisitDto.endDateTime(),wifiSpotVisitDto.userId(),wifiSpotVisitDto.id()
                )
        );

    }


}