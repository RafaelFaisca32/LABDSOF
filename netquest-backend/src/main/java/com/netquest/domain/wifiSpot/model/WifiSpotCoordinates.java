package com.netquest.domain.wifiSpot.model;

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
public class WifiSpotCoordinates {
    private final double longitude;
    private final double latitude;
    public WifiSpotCoordinates(double longitude, double latitude){
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
