package com.netquest.domain.wifispotvisit.model;

import com.netquest.domain.wifispotvisit.exception.EmptyWifiSpotVisitEndDateTimeException;
import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Embeddable
@Getter
@EqualsAndHashCode
@ToString
@NoArgsConstructor(force = true)
public class WifiSpotVisitEndDateTime {
    private final LocalDateTime value;

    public WifiSpotVisitEndDateTime(LocalDateTime value) {
        if(value != null && value.isAfter(LocalDateTime.now())){
            throw new EmptyWifiSpotVisitEndDateTimeException("Wifi Spot Visit End DateTime cannot be in the future");
        }
        this.value = value;
    }
}
