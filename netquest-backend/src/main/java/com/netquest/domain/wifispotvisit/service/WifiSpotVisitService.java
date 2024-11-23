package com.netquest.domain.wifispotvisit.service;

import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitCreateDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitUpdateDateTimeDto;

import java.time.LocalDateTime;
import java.util.UUID;

public interface WifiSpotVisitService {

    WifiSpotVisitDto saveWifiSpotVisit(UUID userUUID, WifiSpotVisitCreateDto wifiSpotVisitCreateDto);

    WifiSpotVisitDto updateWifiSpotVisitEndDateTime(UUID userUUID, UUID wifiSpotVisitUUID, WifiSpotVisitUpdateDateTimeDto wifiSpotVisitEndDateTimeDto);

    WifiSpotVisitDto getWifiSpotVisitOngoing(UUID userUUID);

    WifiSpotVisitDto saveWifiSpotVisitSimple(UUID userUUID, UUID wifiSpotUUID);
}
