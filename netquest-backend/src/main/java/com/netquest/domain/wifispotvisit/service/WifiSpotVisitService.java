package com.netquest.domain.wifispotvisit.service;

import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitCreateDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitHistoryDto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface WifiSpotVisitService {

    WifiSpotVisitDto saveWifiSpotVisit(UUID userUUID, WifiSpotVisitCreateDto wifiSpotVisitCreateDto);

    WifiSpotVisitDto getWifiSpotVisitOngoing(UUID userUUID);

    WifiSpotVisitDto startVisit(UUID userUUID, UUID wifiSpotUUID);

    WifiSpotVisitDto finishVisit(UUID id, UUID wifiSpotVisitUUID);

    List<WifiSpotVisitHistoryDto> getMyWifiSpotsVisits(UUID userUUID, String wifiSpotName, LocalDateTime startDate, LocalDateTime endDate);
}
