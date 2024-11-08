package com.netquest.domain.wifispotvisit.mapper;

import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitCreateDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitUpdateDateTimeDto;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisit;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisitEndDateTime;

public interface WifiSpotVisitMapper {
    WifiSpotVisitDto toDto(WifiSpotVisit wifiSpotVisit);
    WifiSpotVisit toNewEntity(WifiSpotVisitCreateDto wifiSpotVisitCreateDto);
    WifiSpotVisitEndDateTime toEndDateTime(WifiSpotVisitUpdateDateTimeDto wifiSpotVisitUpdateDateTimeDto);
}
