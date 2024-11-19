package com.netquest.infrastructure.wifispot;

import com.netquest.domain.wifispot.model.WifiSpot;

import java.util.List;

public interface WifiSpotRepositoryCustom {
    List<WifiSpot> findFilteredWifiSpots(
        String name, Boolean exactName, String description, Boolean exactDescription,
        String locationType, String wifiQuality, String signalStrength,
        String bandwidth, Boolean crowded, Boolean coveredArea,
        Boolean airConditioning, Boolean goodView, String noiseLevel,
        Boolean petFriendly, Boolean childFriendly, Boolean disableAccess,
        Boolean availablePowerOutlets, Boolean chargingStations,
        Boolean restroomsAvailable, Boolean parkingAvailability,
        Boolean foodOptions, Boolean drinkOptions, Boolean openDuringRain,
        Boolean openDuringHeat, Boolean heatedInWinter,
        Boolean shadedAreas, Boolean outdoorFans
    );
}
