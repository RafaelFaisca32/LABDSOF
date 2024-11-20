package com.netquest.domain.wifispot.service.impl;


import com.netquest.domain.wifispot.dto.WifiSpotCreateDto;
import com.netquest.domain.wifispot.dto.WifiSpotDto;
import com.netquest.domain.wifispot.mapper.WifiSpotMapper;
import com.netquest.domain.wifispot.model.*;
import com.netquest.domain.wifispot.service.WifiSpotService;
import com.netquest.infrastructure.wifispot.WifiSpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class WifiSpotServiceImpl implements WifiSpotService {
    private final WifiSpotRepository wifiSpotRepository;
    private final WifiSpotMapper wifiSpotMapper;

    @Override
    public List<WifiSpotDto> getWifiSpots() {
        List<WifiSpot> wifiSpotList = wifiSpotRepository.findAll();
        return wifiSpotList.stream().map(wifiSpotMapper::wifiSpotDomainToDto).toList();
    }

    @Override
    public WifiSpotDto createWifiSpot(WifiSpotCreateDto wifiSpotDto) {
        WifiSpot wifiSpot = wifiSpotMapper.wifiSpotCreateDtoToDomain(wifiSpotDto);
        return wifiSpotMapper.wifiSpotDomainToDto(wifiSpotRepository.save(wifiSpot));
    }

    @Override
    public int getNumberOfWifiSpots() {
        return wifiSpotRepository.getNumberOfWifiSpots();
    }

    @Override
    public boolean existsById(UUID uuid) {
        WifiSpotId wifiSpotId = new WifiSpotId(uuid);
        return wifiSpotRepository.existsById(wifiSpotId);
    }

    @Override
    public List<WifiSpotDto> getFilteredWifiSpots(
        String name, Boolean exactName,
        String description, Boolean exactDescription,
        String locationType, String wifiQuality, String signalStrength,
        String bandwidth, Boolean crowded, Boolean coveredArea,
        Boolean airConditioning, Boolean goodView, String noiseLevel,
        Boolean petFriendly, Boolean childFriendly, Boolean disableAccess,
        Boolean availablePowerOutlets, Boolean chargingStations,
        Boolean restroomsAvailable, Boolean parkingAvailability,
        Boolean foodOptions, Boolean drinkOptions, Boolean openDuringRain,
        Boolean openDuringHeat, Boolean heatedInWinter,
        Boolean shadedAreas, Boolean outdoorFans
    ) {



        String nameFilter = null;
        if (name != null) {
            nameFilter = (exactName != null && exactName) ? name : ("%" + name + "%");
        }
        String descFilter = null;
        if (description != null) {
            descFilter = (exactDescription != null && exactDescription) ? description : ("%" + description + "%");
        }





        List<WifiSpot> l =  wifiSpotRepository.findFilteredWifiSpots(
            nameFilter, descFilter,
            locationType, wifiQuality, signalStrength,
            bandwidth, crowded, coveredArea, airConditioning,
            goodView, noiseLevel, petFriendly, childFriendly,
            disableAccess, availablePowerOutlets, chargingStations,
            restroomsAvailable, parkingAvailability, foodOptions,
            drinkOptions, openDuringRain, openDuringHeat,
            heatedInWinter, shadedAreas, outdoorFans
        );
        return l.stream().map(wifiSpotMapper::wifiSpotDomainToDto).toList();
    }
}
