package com.netquest.domain.wifispot.model;

import com.netquest.domain.shared.LocationType;
import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Embeddable
@Getter
@EqualsAndHashCode
@ToString
@NoArgsConstructor(force = true)
public class WifiSpotLocationType {
    private final LocationType value;
    public WifiSpotLocationType(LocationType locationType){
        value = locationType;
    }
}
