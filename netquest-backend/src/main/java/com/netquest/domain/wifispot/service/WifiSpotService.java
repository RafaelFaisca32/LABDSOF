package com.netquest.domain.wifispot.service;

import com.netquest.domain.user.model.User;
import com.netquest.domain.wifispot.dto.WifiSpotCreateDto;
import com.netquest.domain.wifispot.dto.WifiSpotDto;
import com.netquest.domain.wifispot.dto.WifiSpotFilterDto;
import com.netquest.domain.wifispot.model.WifiSpot;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WifiSpotService {
    List<WifiSpotDto> getWifiSpots();

    WifiSpotDto createWifiSpot(WifiSpotCreateDto wifiSpotDto, UUID userUUID);

    int getNumberOfWifiSpots();

    boolean existsById(UUID uuid);

    List<WifiSpotDto> getFilteredWifiSpots(String name, Boolean exactName, String description, Boolean exactDescription, String locationType, String wifiQuality, String signalStrength, String bandwidth, Boolean crowded, Boolean coveredArea, Boolean airConditioning, Boolean goodView, String noiseLevel, Boolean petFriendly, Boolean childFriendly, Boolean disableAccess, Boolean availablePowerOutlets, Boolean chargingStations, Boolean restroomsAvailable, Boolean parkingAvailability, Boolean foodOptions, Boolean drinkOptions, Boolean openDuringRain, Boolean openDuringHeat, Boolean heatedInWinter, Boolean shadedAreas, Boolean outdoorFans);

    List<WifiSpotDto> getWifiSpotsWithFilters(WifiSpotFilterDto wifiSpotFilterDto);
}
