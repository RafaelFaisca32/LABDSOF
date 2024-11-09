package com.netquest.domain.wifispotvisit.model;


import com.netquest.domain.wifispotvisit.exception.EmptyWifiSpotVisitEndDateTimeException;
import com.netquest.domain.wifispotvisit.exception.EmptyWifiSpotVisitStartDateTimeException;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.time.LocalDateTime;

@Embeddable
@Getter
@EqualsAndHashCode
@ToString
@NoArgsConstructor(force = true)
public class WifiSpotVisitStartDateTime implements Comparable<WifiSpotVisitStartDateTime> {
    @NonNull
    private final LocalDateTime value;

    public WifiSpotVisitStartDateTime(@NonNull LocalDateTime value) {
        if(value.isAfter(LocalDateTime.now())){
            throw new EmptyWifiSpotVisitStartDateTimeException("Wifi Spot Visit Start DateTime cannot be in the future");
        }
        this.value = value;

    }

    @Override
    public int compareTo(WifiSpotVisitStartDateTime other) {
        return this.value.compareTo(other.value);
    }
}
