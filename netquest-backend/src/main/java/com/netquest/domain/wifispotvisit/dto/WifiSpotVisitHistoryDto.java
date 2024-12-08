package com.netquest.domain.wifispotvisit.dto;

import java.time.LocalDateTime;
import java.util.UUID;


public record WifiSpotVisitHistoryDto(
        UUID id,
        LocalDateTime startDateTime,
        LocalDateTime endDateTime,
        UUID userId,
        String wifiSpotName,
        String wifiSpotAddress,
        UUID wifiSpotId
) {}
