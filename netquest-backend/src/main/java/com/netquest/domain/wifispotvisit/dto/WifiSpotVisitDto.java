package com.netquest.domain.wifispotvisit.dto;

import java.time.LocalDateTime;
import java.util.UUID;


public record WifiSpotVisitDto (
        UUID wifiSpotVisitId,
        LocalDateTime wifiSpotVisitStartDateTime,
        LocalDateTime wifiSpotVisitEndDateTime,
        UUID userId,
        UUID wifiSpotId) {}
