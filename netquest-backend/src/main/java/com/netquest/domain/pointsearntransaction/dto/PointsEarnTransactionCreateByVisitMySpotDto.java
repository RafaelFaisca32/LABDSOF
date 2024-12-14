package com.netquest.domain.pointsearntransaction.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PointsEarnTransactionCreateByVisitMySpotDto {
    @NotNull
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;

    @NotNull
    private UUID wifiSpotVisitId;
    private UUID userId;
}
