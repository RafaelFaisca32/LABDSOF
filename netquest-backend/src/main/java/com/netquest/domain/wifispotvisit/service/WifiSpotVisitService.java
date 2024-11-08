package com.netquest.domain.wifispotvisit.service;

import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitCreateDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitUpdateDateTimeDto;

import java.time.LocalDateTime;

public interface WifiSpotVisitService {

    WifiSpotVisitDto saveWifiSpotVisit(WifiSpotVisitCreateDto wifiSpotVisitCreateDto);
    WifiSpotVisitDto updateWifiSpotVisitEndDateTime(WifiSpotVisitUpdateDateTimeDto wifiSpotVisitEndDateTimeDto);
}
