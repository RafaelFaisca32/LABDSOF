package com.netquest.domain.wifispotvisit.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class WifiSpotVisitUpdateDateTimeDto {
    @NotNull
    private UUID wifiSpotVisitId;
    @NotNull
    private LocalDateTime wifiSpotVisitDateTime;
}
