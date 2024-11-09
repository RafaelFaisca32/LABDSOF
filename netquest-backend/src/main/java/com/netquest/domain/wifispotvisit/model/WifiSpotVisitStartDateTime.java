package com.netquest.domain.wifispotvisit.model;


import jakarta.persistence.Embeddable;
import lombok.*;

import java.time.LocalDateTime;

@Embeddable
@Getter
@EqualsAndHashCode
@ToString
@NoArgsConstructor(force = true)
public class WifiSpotVisitStartDateTime {
    @NonNull
    private final LocalDateTime value;

    public WifiSpotVisitStartDateTime(@NonNull LocalDateTime value) {
        if(value.isAfter(LocalDateTime.now())){
            throw new IllegalArgumentException("Wifi Spot Visit Start DateTime cannot be in the future");
        }
        this.value = value;

    }
}
