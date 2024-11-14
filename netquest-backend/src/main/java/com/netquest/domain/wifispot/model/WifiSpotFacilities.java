package com.netquest.domain.wifispot.model;

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
public class WifiSpotFacilities {
    private final boolean availablePowerOutlets;
    private final boolean chargingStations;
    private final boolean restroomsAvailable;
    private final boolean parkingAvailability;
    private final boolean foodOptions;
    private final boolean drinkOptions;

    public WifiSpotFacilities(boolean availablePowerOutlets, boolean chargingStations, boolean restroomsAvailable, boolean parkingAvailability, boolean foodOptions, boolean drinkOptions) {
        this.availablePowerOutlets = availablePowerOutlets;
        this.chargingStations = chargingStations;
        this.restroomsAvailable = restroomsAvailable;
        this.parkingAvailability = parkingAvailability;
        this.foodOptions = foodOptions;
        this.drinkOptions = drinkOptions;
    }
}
