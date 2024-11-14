package com.netquest.domain.wifispot.model;

import com.netquest.domain.shared.NoiseType;
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
public class WifiSpotEnvironmentalFeatures {
    private final boolean crowded;
    private final boolean coveredArea;
    private final boolean airConditioning;
    private final boolean outdoorSeating;
    private final boolean goodView;
    private final NoiseType noiseLevel;
    private final boolean petFriendly;
    private final boolean childFriendly;
    private final boolean disabledAccess;

    public WifiSpotEnvironmentalFeatures(boolean crowded, boolean coveredArea, boolean airConditioning, boolean outdoorSeating, boolean goodView, NoiseType noiseLevel, boolean petFriendly, boolean childFriendly, boolean disabledAccess) {
        this.crowded = crowded;
        this.coveredArea = coveredArea;
        this.airConditioning = airConditioning;
        this.outdoorSeating = outdoorSeating;
        this.goodView = goodView;
        this.noiseLevel = noiseLevel;
        this.petFriendly = petFriendly;
        this.childFriendly = childFriendly;
        this.disabledAccess = disabledAccess;
    }
}
