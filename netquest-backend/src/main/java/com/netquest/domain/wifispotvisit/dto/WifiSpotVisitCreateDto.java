package com.netquest.domain.wifispotvisit.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class WifiSpotVisitCreateDto {

    @NotNull
    private LocalDateTime wifiSpotVisitStartDateTime;

    private LocalDateTime wifiSpotVisitEndDateTime;

    @NotNull
    private UUID userId;

    @NotNull
    private UUID wifiSpotId;
}
