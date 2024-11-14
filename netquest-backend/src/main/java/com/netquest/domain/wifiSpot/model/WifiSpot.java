package com.netquest.domain.wifiSpot.model;

import com.netquest.domain.shared.LocationType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(force = true)
@Entity
@Table(name = "wifi_spot", uniqueConstraints = {
        @UniqueConstraint(columnNames = "wifi_spot_latitude"),
        @UniqueConstraint(columnNames = "wifi_spot_longitude")
})
public class WifiSpot {

    @EmbeddedId
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "wifi_spot_id"))
    })
    private final WifiSpotId wifiSpotId;

    @Embedded
    @NotNull
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "wifi_spot_name"))
    })
    private final WifiSpotName wifiSpotName;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "wifi_spot_description"))
    })
    private final WifiSpotDescription wifiSpotDescription;

    @Embedded
    @NotNull
    @AttributeOverrides({
            @AttributeOverride(name = "longitude", column = @Column(name = "wifi_spot_longitude")),
            @AttributeOverride(name = "latitude", column = @Column(name = "wifi_spot_latitude"))
    })
    private final WifiSpotCoordinates wifiSpotCoordinates;

    @Embedded
    @NotNull
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "wifi_spot_location_type"))
    })
    private final WifiSpotLocationType wifiSpotLocationType;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "wifiQuality", column = @Column(name = "wifi_spot_wifi_quality")),
            @AttributeOverride(name = "signalStrength", column = @Column(name = "wifi_spot_signal_strength")),
            @AttributeOverride(name = "bandwithLimitations", column = @Column(name = "wifi_spot_bandwith_limitations"))
    })
    private final WifiSpotQualityIndicators wifiSpotQualityIndicators;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "crowded", column = @Column(name = "wifi_spot_crowded")),
            @AttributeOverride(name = "coveredArea", column = @Column(name = "wifi_spot_covered_area")),
            @AttributeOverride(name = "airConditioning", column = @Column(name = "wifi_spot_air_conditioning")),
            @AttributeOverride(name = "outdoorSeating", column = @Column(name = "wifi_spot_outdoor_seating")),
            @AttributeOverride(name = "goodView", column = @Column(name = "wifi_spot_good_view")),
            @AttributeOverride(name = "noiseLevel", column = @Column(name = "wifi_spot_noise_level")),
            @AttributeOverride(name = "petFriendly", column = @Column(name = "wifi_spot_pet_fiendly")),
            @AttributeOverride(name = "childFriendly", column = @Column(name = "wifi_spot_child_friendly")),
            @AttributeOverride(name = "disabledAccess", column = @Column(name = "wifi_spot_disabled_access"))
    })
    private final WifiSpotEnvironmentalFeatures wifiSpotEnvironmentalFeatures;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "availablePowerOutlets", column = @Column(name = "wifi_spot_available_power_outlets")),
            @AttributeOverride(name = "chargingStations", column = @Column(name = "wifi_spot_charging_stations")),
            @AttributeOverride(name = "restroomsAvailable", column = @Column(name = "wifi_spot_restrooms_available")),
            @AttributeOverride(name = "parkingAvailability", column = @Column(name = "wifi_spot_parking_availability")),
            @AttributeOverride(name = "foodOptions", column = @Column(name = "wifi_spot_food_options")),
            @AttributeOverride(name = "drinkOptions", column = @Column(name = "wifi_spot_drink_options"))
    })
    private final WifiSpotFacilities wifiSpotFacilities;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "openDuringRain", column = @Column(name = "wifi_spot_open_during_rain")),
            @AttributeOverride(name = "openDuringHeat", column = @Column(name = "wifi_spot_open_during_heat")),
            @AttributeOverride(name = "heatedInWinter", column = @Column(name = "wifi_spot_heated_in_winter")),
            @AttributeOverride(name = "shadedAreas", column = @Column(name = "wifi_spot_shaded_areas")),
            @AttributeOverride(name = "outdoorFans", column = @Column(name = "wifi_spot_outdoor_fans"))
    })
    private final WifiSpotWeatherFeatures wifiSpotWeatherFeatures;

    @OneToOne
    private final WifiSpotAddress wifiSpotAddress;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "wifi_spot_management"))
    })
    private final WifiSpotManagement wifiSpotManagement;

    public WifiSpot(WifiSpotName wifiSpotName, WifiSpotDescription wifiSpotDescription, WifiSpotCoordinates wifiSpotCoordinates, WifiSpotLocationType wifiSpotLocationType, WifiSpotQualityIndicators wifiSpotQualityIndicators, WifiSpotEnvironmentalFeatures wifiSpotEnvironmentalFeatures, WifiSpotFacilities wifiSpotFacilities, WifiSpotWeatherFeatures wifiSpotWeatherFeatures, WifiSpotAddress wifiSpotAddress, WifiSpotManagement wifiSpotManagement) {
        this.wifiSpotId = new WifiSpotId();
        this.wifiSpotName = wifiSpotName;
        this.wifiSpotDescription = wifiSpotDescription;
        this.wifiSpotCoordinates = wifiSpotCoordinates;
        this.wifiSpotLocationType = wifiSpotLocationType;
        this.wifiSpotQualityIndicators = wifiSpotQualityIndicators;
        this.wifiSpotEnvironmentalFeatures = wifiSpotEnvironmentalFeatures;
        this.wifiSpotFacilities = wifiSpotFacilities;
        this.wifiSpotWeatherFeatures = wifiSpotWeatherFeatures;
        this.wifiSpotAddress = wifiSpotAddress;
        this.wifiSpotManagement = wifiSpotManagement;
    }
}
