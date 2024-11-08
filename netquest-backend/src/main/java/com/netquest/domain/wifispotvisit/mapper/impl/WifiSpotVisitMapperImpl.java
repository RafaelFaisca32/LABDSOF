package com.netquest.domain.wifispotvisit.mapper.impl;

import com.netquest.domain.user.model.UserId;
import com.netquest.domain.wifispot.model.WifiSpotId;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitCreateDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitUpdateDateTimeDto;
import com.netquest.domain.wifispotvisit.mapper.WifiSpotVisitMapper;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisit;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisitEndDateTime;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisitStartDateTime;
import org.springframework.stereotype.Service;


@Service
public class WifiSpotVisitMapperImpl implements WifiSpotVisitMapper {
    @Override
    public WifiSpotVisitDto toDto(WifiSpotVisit wifiSpotVisit) {

        if (wifiSpotVisit == null) {
            return null;
        }

        return new WifiSpotVisitDto(
                wifiSpotVisit.getWifiSpotVisitId() != null ? wifiSpotVisit.getWifiSpotVisitId().getValue() : null,
                wifiSpotVisit.getWifiSpotVisitStartDateTime() != null ? wifiSpotVisit.getWifiSpotVisitStartDateTime() .getValue() : null,
                wifiSpotVisit.getWifiSpotVisitEndDateTime() != null ? wifiSpotVisit.getWifiSpotVisitEndDateTime().getValue() : null,
                wifiSpotVisit.getUserId() != null ? wifiSpotVisit.getUserId().getValue() : null,
                wifiSpotVisit.getWifiSpotId() != null ? wifiSpotVisit.getWifiSpotId().getValue() : null);
    }

    @Override
    public WifiSpotVisit toNewEntity(WifiSpotVisitCreateDto wifiSpotVisitCreateDto) {
        return new WifiSpotVisit(
                new WifiSpotVisitStartDateTime(wifiSpotVisitCreateDto.getEndDateTime()),
                new WifiSpotVisitEndDateTime(wifiSpotVisitCreateDto.getEndDateTime()),
                new WifiSpotId(wifiSpotVisitCreateDto.getWifiSpotId()),
                new UserId(wifiSpotVisitCreateDto.getUserId()));
    }

    @Override
    public WifiSpotVisitEndDateTime toEndDateTime(WifiSpotVisitUpdateDateTimeDto wifiSpotVisitUpdateDateTimeDto) {
        if (wifiSpotVisitUpdateDateTimeDto == null) {
            return null;
        }
        return new WifiSpotVisitEndDateTime(wifiSpotVisitUpdateDateTimeDto.getDateTime());
    }
}
