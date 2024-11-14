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
public class WifiSpotAddressDistrict {
    private final String value;

    public WifiSpotAddressDistrict(String value) {
        this.value = value;
    }
}
