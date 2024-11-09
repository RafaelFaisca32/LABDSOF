package com.netquest.domain.pointsearntransaction.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record PointsEarnTransactionDto(
        UUID id,
        LocalDateTime datetime,
        long amount
) {
}
