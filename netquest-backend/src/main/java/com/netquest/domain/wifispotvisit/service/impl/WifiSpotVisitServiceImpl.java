package com.netquest.domain.wifispotvisit.service.impl;

import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionCreateByVisitDto;
import com.netquest.domain.pointsearntransaction.service.PointsEarnTransactionService;
import com.netquest.domain.user.exception.UserNotFoundException;
import com.netquest.domain.user.model.UserId;
import com.netquest.domain.user.service.UserService;
import com.netquest.domain.wifispot.exception.WifiSpotNotFoundException;
import com.netquest.domain.wifispot.model.WifiSpotId;
import com.netquest.domain.wifispot.service.WifiSpotService;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitCreateDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitUpdateDateTimeDto;
import com.netquest.domain.wifispotvisit.exception.*;
import com.netquest.domain.wifispotvisit.mapper.WifiSpotVisitMapper;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisit;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisitEndDateTime;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisitId;
import com.netquest.domain.wifispotvisit.service.WifiSpotVisitService;
import com.netquest.infrastructure.wifispotvisit.WifiSpotVisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class WifiSpotVisitServiceImpl implements WifiSpotVisitService {
    private final WifiSpotVisitRepository wifiSpotVisitRepository;
    private final WifiSpotVisitMapper wifiSpotVisitMapper;
    private final PointsEarnTransactionService pointsEarnTransactionService;
    private final UserService userService;
    private final WifiSpotService wifiSpotService;


    @Override
    public WifiSpotVisitDto saveWifiSpotVisit(UUID userUUID, WifiSpotVisitCreateDto wifiSpotVisitCreateDto) {
        WifiSpotVisit wifiSpotVisit = wifiSpotVisitMapper.toNewEntity(userUUID,wifiSpotVisitCreateDto);


        if(!userService.existsById(userUUID)){
            throw new UserNotFoundException("User not found");
        }

        if(!wifiSpotService.existsById(wifiSpotVisitCreateDto.getWifiSpotId())){
            throw new WifiSpotNotFoundException("Wifi Spot not found");
        }

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
        WifiSpotId wifiSpotId = new WifiSpotId(wifiSpotVisitCreateDto.getWifiSpotId());
        LocalDateTime wifiSpotVisitStartDate10MinutesAgo = wifiSpotVisitCreateDto.getStartDateTime().minusMinutes(10);
        if(wifiSpotVisitRepository.existsWifiSpotVisitInSameWifiSpotInLast10MinutesByUserId(userId,wifiSpotId,wifiSpotVisitStartDate10MinutesAgo)){
            throw new WifiSpotVisitInSameWifiSpotInLast10Minutes("There is already a visit in the same wifi spot in last 10 minutes");
        }

        WifiSpotVisitDto wifiSpotVisitDto = wifiSpotVisitMapper.toDto(wifiSpotVisitRepository.save(wifiSpotVisit));
        createPointsEarnTransactionBasedOnVisit(wifiSpotVisitDto);
        return wifiSpotVisitDto;

    }

    @Override
    public WifiSpotVisitDto finishVisit(UUID userUUID, UUID wifiSpotVisitUUID) {
        WifiSpotVisitId wifiSpotVisitId = new WifiSpotVisitId(wifiSpotVisitUUID);
        UserId userId = new UserId(userUUID);
        WifiSpotVisit wifiSpotVisit = wifiSpotVisitRepository.findByWifiSpotVisitIdAndUserId(wifiSpotVisitId,userId)
                .orElseThrow(() -> new WifiSpotVisitNotFoundException("Wifi spot visit not found"));


        if(wifiSpotVisit.getWifiSpotVisitEndDateTime() != null){
            throw new WifiSpotVisitEndDateTimeAlreadyFilledException("Wifi spot visit end date time already filled");
        }



        WifiSpotVisitEndDateTime wifiSpotVisitEndDateTime = new WifiSpotVisitEndDateTime(LocalDateTime.now());
        wifiSpotVisit.updateEndDateTime(wifiSpotVisitEndDateTime);

        WifiSpotVisitDto wifiSpotVisitDto = wifiSpotVisitMapper.toDto(wifiSpotVisitRepository.save(wifiSpotVisit));
        createPointsEarnTransactionBasedOnVisit(wifiSpotVisitDto);
        return wifiSpotVisitDto;
    }

    @Override
    public WifiSpotVisitDto getWifiSpotVisitOngoing(UUID userUUID) {
        if(!userService.existsById(userUUID)){
            throw new UserNotFoundException("User not found");
        }
        UserId userId = new UserId(userUUID);
        WifiSpotVisit wifiSpotVisit = wifiSpotVisitRepository.getOnGoingWifiSpotVisitByUserId(userId).orElseThrow(
                () -> new WifiSpotVisitNotFoundException("There is not any wifi spot visit ongoing"));
        return wifiSpotVisitMapper.toDto(wifiSpotVisit);

    }

    @Override
    public WifiSpotVisitDto startVisit(UUID userUUID, UUID wifiSpotUUID) {
        WifiSpotVisitCreateDto wifiSpotVisitCreateDto = new WifiSpotVisitCreateDto();
        wifiSpotVisitCreateDto.setWifiSpotId(wifiSpotUUID);
        wifiSpotVisitCreateDto.setStartDateTime(LocalDateTime.now());
        return saveWifiSpotVisit(userUUID, wifiSpotVisitCreateDto) ;
    }


    private void createPointsEarnTransactionBasedOnVisit(WifiSpotVisitDto wifiSpotVisitDto) {
        if(wifiSpotVisitDto.endDateTime() == null) {
            return;
        }
        pointsEarnTransactionService.savePointsEarnTransaction(
                new PointsEarnTransactionCreateByVisitDto(
                        wifiSpotVisitDto.startDateTime(), wifiSpotVisitDto.endDateTime(), wifiSpotVisitDto.userId(), wifiSpotVisitDto.id()
                )
        );

    }


}
