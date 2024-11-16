package com.netquest.domain.wifispot.dto;

import com.netquest.domain.shared.*;

import java.time.LocalTime;

public record WifiSpotCreateDto(
        String wifiSpotName,
        String wifiSpotDescription,
        double latitude,
        double longitude,
        LocationType locationType,
        QualityType qualityType,
        StrengthType strengthType,
        BandwithType bandwithType,
        LocalTime startPeakUsageTime,
        LocalTime endPeakUsageTime,
        boolean crowded,
        boolean coveredArea,
        boolean airConditioning,
        boolean outdoorSeating,
        boolean goodView,
        NoiseType noiseType,
        boolean petFriendly,
        boolean childFriendly,
        boolean disabledAccess,
        boolean availablePowerOutlets,
        boolean chargingStations,
        boolean restroomsAvailable,
        boolean parkingAvailability,
        boolean foodOptions,
        boolean drinkOptions,
        boolean openDuringRain,
        boolean openDuringHeat,
        boolean heatedInWinter,
        boolean shadedAreas,
        boolean outdoorFans,
        WifiSpotAddressCreateDto wifiSpotAddressDto,
        WifiSpotManagementType wifiSpotManagementType
) {
}