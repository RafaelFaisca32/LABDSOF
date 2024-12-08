package com.netquest.domain.wifispot.service.impl;


import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionCreateByWifiSpotCreationDto;
import com.netquest.domain.pointsearntransaction.service.PointsEarnTransactionService;
import com.netquest.domain.shared.*;
import com.netquest.domain.user.exception.UserNotFoundException;
import com.netquest.domain.user.service.UserService;
import com.netquest.domain.wifispot.dto.WifiSpotCreateDto;
import com.netquest.domain.wifispot.dto.WifiSpotDto;
import com.netquest.domain.wifispot.dto.WifiSpotFilterDto;
import com.netquest.domain.wifispot.exception.WifiSpotNotFoundException;
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
    private final UserService userService;
    private final PointsEarnTransactionService pointsEarnTransactionService;

    @Override
    public List<WifiSpotDto> getWifiSpots() {
        List<WifiSpot> wifiSpotList = wifiSpotRepository.findAll();
        return wifiSpotList.stream().map(wifiSpotMapper::wifiSpotDomainToDto).toList();
    }

    @Override
    public WifiSpotDto createWifiSpot(WifiSpotCreateDto wifiSpotDto, UUID userUUID) {



        if(!userService.existsById(userUUID)){
            throw new UserNotFoundException("User not found");
        }


        WifiSpot wifiSpot = wifiSpotMapper.wifiSpotCreateDtoToDomain(wifiSpotDto,userUUID);
        WifiSpotDto wifiSpotDtoNew = wifiSpotMapper.wifiSpotDomainToDto(wifiSpotRepository.save(wifiSpot));

        createPointsEarnTransactionBasedOnWifiSpotCreation(wifiSpotDtoNew);

        return wifiSpotDtoNew;
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
    public WifiSpotDto getWifiSpotById(UUID uuid) {
        WifiSpotId wifiSpotId = new WifiSpotId(uuid);
        WifiSpot wifiSpotDto = wifiSpotRepository.findById(wifiSpotId).orElseThrow(() -> new WifiSpotNotFoundException("WifiSpot not found"));
        return wifiSpotMapper.wifiSpotDomainToDto(wifiSpotDto);
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
            nameFilter = (exactName != null && exactName) ? escapeForLike(name) : ("%" + escapeForLike(name) + "%");
        }
        String descFilter = null;
        if (description != null) {
            descFilter = (exactDescription != null && exactDescription) ? escapeForLike(description) : ("%" + escapeForLike(description) + "%");
        }





        List<WifiSpot> l =  wifiSpotRepository.findFilteredWifiSpots(
            nameFilter, descFilter,
            LocationType.valueOf(locationType),QualityType.valueOf(wifiQuality), StrengthType.valueOf(signalStrength),
            BandwithType.valueOf(bandwidth), crowded, coveredArea, airConditioning,
            goodView, NoiseType.valueOf(noiseLevel), petFriendly, childFriendly,
            disableAccess, availablePowerOutlets, chargingStations,
            restroomsAvailable, parkingAvailability, foodOptions,
            drinkOptions, openDuringRain, openDuringHeat,
            heatedInWinter, shadedAreas, outdoorFans
        );
        return l.stream().map(wifiSpotMapper::wifiSpotDomainToDto).toList();
    }

    @Override
    public List<WifiSpotDto> getWifiSpotsWithFilters(WifiSpotFilterDto wifiSpotFilterDto) {

        String name = null;
        String description = null;
        boolean exactName = false;
        boolean exactDescription = false;
        LocationType locationType = null;
        QualityType wifiQuality = null;
        StrengthType signalStrength = null;
        BandwithType bandwidth = null;
        Boolean crowded = null;
        Boolean coveredArea = null;
        Boolean airConditioning = null;
        Boolean goodView = null;
        NoiseType noiseLevel = null;
        Boolean petFriendly = null;
        Boolean childFriendly = null;
        Boolean disableAccess = null;
        Boolean availablePowerOutlets = null;
        Boolean chargingStations = null;
        Boolean restroomsAvailable = null;
        Boolean parkingAvailability = null;
        Boolean foodOptions = null;
        Boolean drinkOptions = null;
        Boolean openDuringRain = null;
        Boolean openDuringHeat  = null;
        Boolean heatedInWinter = null;
        Boolean shadedAreas  = null;
        Boolean outdoorFans  = null;

        if(wifiSpotFilterDto != null) {
            exactName = wifiSpotFilterDto.getExactName() != null && wifiSpotFilterDto.getExactName();
            exactDescription = wifiSpotFilterDto.getExactDescription() != null && wifiSpotFilterDto.getExactDescription();

            if(wifiSpotFilterDto.getName() != null) {
                if(!exactName) {
                    name = "%" + escapeForLike(wifiSpotFilterDto.getName()) + "%";
                } else {
                    name = escapeForLike(wifiSpotFilterDto.getName());
                }
            }

            if(wifiSpotFilterDto.getDescription() != null) {
                if(!exactDescription) {
                    description = "%" + escapeForLike(wifiSpotFilterDto.getDescription()) + "%";
                } else {
                    description = escapeForLike(wifiSpotFilterDto.getDescription());
                }
            }

            locationType = wifiSpotFilterDto.getLocationType();
            wifiQuality = wifiSpotFilterDto.getWifiQuality();
            signalStrength = wifiSpotFilterDto.getSignalStrength();
            bandwidth = wifiSpotFilterDto.getBandwidth();
            crowded = wifiSpotFilterDto.getCrowded();
            coveredArea = wifiSpotFilterDto.getCoveredArea();
            airConditioning = wifiSpotFilterDto.getAirConditioning();
            goodView = wifiSpotFilterDto.getGoodView();
            noiseLevel = wifiSpotFilterDto.getNoiseLevel();
            petFriendly = wifiSpotFilterDto.getPetFriendly();
            childFriendly = wifiSpotFilterDto.getChildFriendly();
            disableAccess = wifiSpotFilterDto.getDisableAccess();
            availablePowerOutlets = wifiSpotFilterDto.getAvailablePowerOutlets();
            chargingStations = wifiSpotFilterDto.getChargingStations();
            restroomsAvailable = wifiSpotFilterDto.getRestroomsAvailable();
            parkingAvailability = wifiSpotFilterDto.getParkingAvailability();
            foodOptions = wifiSpotFilterDto.getFoodOptions();
            drinkOptions = wifiSpotFilterDto.getDrinkOptions();
            openDuringRain = wifiSpotFilterDto.getOpenDuringRain();
            openDuringHeat  = wifiSpotFilterDto.getOpenDuringHeat();
            heatedInWinter = wifiSpotFilterDto.getHeatedInWinter();
            shadedAreas  = wifiSpotFilterDto.getShadedAreas();
            outdoorFans  = wifiSpotFilterDto.getOutdoorFans();

        }


        List<WifiSpot> l =  wifiSpotRepository.findFilteredWifiSpots(
                name, description,
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

    private String escapeForLike(String input) {
        if (input == null) {
            return null;
        }
        return input
                .replace("\\", "\\\\") // Escape backslash
                .replace("%", "\\%")   // Escape percent
                .replace("_", "\\_");  // Escape underscore
    }

    private void createPointsEarnTransactionBasedOnWifiSpotCreation(WifiSpotDto wifiSpotDto) {
        pointsEarnTransactionService.savePointsEarnTransactionByWifiSpotCreation(
                new PointsEarnTransactionCreateByWifiSpotCreationDto(
                        wifiSpotDto.userId(), wifiSpotDto.uuid()
                )
        );
    }
}
