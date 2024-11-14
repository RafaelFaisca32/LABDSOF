package com.netquest.domain.wifiSpot.model;

import com.netquest.domain.shared.BandwithType;
import com.netquest.domain.shared.QualityType;
import com.netquest.domain.shared.StrengthType;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.antlr.v4.runtime.misc.Pair;

import java.time.LocalTime;

@Embeddable
@Getter
@EqualsAndHashCode
@ToString
@NoArgsConstructor(force = true)
public class WifiSpotQualityIndicators {
    private final QualityType wifiQuality;
    private final StrengthType signalStrength;
    private final BandwithType bandwithLimitations;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "wifiQuality", column = @Column(name = "wifi_spot_peak_usage_start_time")),
            @AttributeOverride(name = "signalStrength", column = @Column(name = "wifi_spot_peak_usage_end_time"))
    })
    private final WifiSpotPeakUsageInterval peakUsageHourInterval;

    public WifiSpotQualityIndicators(QualityType wifiQuality, StrengthType signalStrength, BandwithType bandwithLimitations, WifiSpotPeakUsageInterval peakUsageHourInterval) {
        this.wifiQuality = wifiQuality;
        this.signalStrength = signalStrength;
        this.bandwithLimitations = bandwithLimitations;
        this.peakUsageHourInterval = peakUsageHourInterval;
    }
}
