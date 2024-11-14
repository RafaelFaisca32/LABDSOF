package com.netquest.domain.pointsearntransaction.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class PointsEarnTransactionCreateByVisitDto {

    @NotNull
    private LocalDateTime startDateTime;

    private LocalDateTime endDateTime;

    @NotNull
    private UUID userId;

    @NotNull
    private UUID wifiSpotVisitId;
}
