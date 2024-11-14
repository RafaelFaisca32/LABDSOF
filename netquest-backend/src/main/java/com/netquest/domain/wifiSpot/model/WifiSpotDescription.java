package com.netquest.domain.wifiSpot.model;

import com.netquest.domain.shared.WifiSpotManagementType;
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
public class WifiSpotDescription {
    private final WifiSpotManagementType value;

    public WifiSpotDescription(WifiSpotManagementType value) {
        this.value = value;
    }
}
