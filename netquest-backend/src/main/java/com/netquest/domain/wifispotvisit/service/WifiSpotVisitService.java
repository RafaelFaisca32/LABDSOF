package com.netquest.domain.wifispotvisit.service;

import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitCreateDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitDto;

import java.util.UUID;

public interface WifiSpotVisitService {

    WifiSpotVisitDto saveWifiSpotVisit(UUID userUUID, WifiSpotVisitCreateDto wifiSpotVisitCreateDto);

    WifiSpotVisitDto getWifiSpotVisitOngoing(UUID userUUID);

    WifiSpotVisitDto startVisit(UUID userUUID, UUID wifiSpotUUID);

    WifiSpotVisitDto finishVisit(UUID id, UUID wifiSpotVisitUUID);

    boolean hasUserVisitedWifiSpotBasedOnMinutes(UUID userUUID, UUID wifiSpotUUID, long minutes);
}
