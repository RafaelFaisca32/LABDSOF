package com.netquest.domain.wifispotvisit.service.impl;

import com.netquest.domain.user.model.UserId;
import com.netquest.domain.wifispot.model.WifiSpotId;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitCreateDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitUpdateDateTimeDto;
import com.netquest.domain.wifispotvisit.exception.WifiSpotVisitNotFoundException;
import com.netquest.domain.wifispotvisit.mapper.WifiSpotVisitMapper;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisit;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisitEndDateTime;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisitId;
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


    @Override
    public WifiSpotVisitDto saveWifiSpotVisit(WifiSpotVisitCreateDto wifiSpotVisitCreateDto) {
        WifiSpotVisit wifiSpotVisit = wifiSpotVisitMapper.toNewEntity(wifiSpotVisitCreateDto);

        UserId userId = new UserId(wifiSpotVisitCreateDto.getUserId());
        /*TODO: verify if user exists
        if(!userRepository.existsById(userId)){
            throw new UserNotFoundException("User not found")
        }
        */
        WifiSpotId wifiSpotId = new WifiSpotId(wifiSpotVisitCreateDto.getWifiSpotId());
        /*TODO: verify if wifi spot exists
        if(!wifiSpotRepository.existsById(wifiSpotId)){
            throw new WifiSpotNotFoundException("Wifi Spot not found")
        }
         */
        return wifiSpotVisitMapper.toDto(wifiSpotVisitRepository.save(wifiSpotVisit));

    }

    @Override
    public WifiSpotVisitDto updateWifiSpotVisitEndDateTime(UUID wifiSpotVisitUUID, WifiSpotVisitUpdateDateTimeDto wifiSpotVisitEndDateTimeDto) {
        WifiSpotVisitId wifiSpotVisitId = new WifiSpotVisitId(wifiSpotVisitUUID);
        WifiSpotVisit wifiSpotVisit = wifiSpotVisitRepository.findById(wifiSpotVisitId)
                .orElseThrow(() -> new WifiSpotVisitNotFoundException("Wifi spot visit not found"));

        WifiSpotVisitEndDateTime wifiSpotVisitEndDateTime = new WifiSpotVisitEndDateTime(wifiSpotVisitEndDateTimeDto.getWifiSpotVisitDateTime());
        wifiSpotVisit.updateEndDateTime(wifiSpotVisitEndDateTime);
        return wifiSpotVisitMapper.toDto(wifiSpotVisitRepository.save(wifiSpotVisit));
    }
}
