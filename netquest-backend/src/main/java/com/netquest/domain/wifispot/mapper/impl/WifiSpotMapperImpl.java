package com.netquest.domain.wifispot.mapper.impl;

import com.netquest.domain.wifispot.dto.WifiSpotAddressCreateDto;
import com.netquest.domain.wifispot.dto.WifiSpotAddressDto;
import com.netquest.domain.wifispot.dto.WifiSpotCreateDto;
import com.netquest.domain.wifispot.dto.WifiSpotDto;
import com.netquest.domain.wifispot.mapper.WifiSpotMapper;
import com.netquest.domain.wifispot.model.*;
import org.springframework.stereotype.Service;

@Service
public class WifiSpotMapperImpl implements WifiSpotMapper {
    @Override
    public WifiSpotDto wifiSpotDomainToDto(WifiSpot wifiSpot) {
        return new WifiSpotDto(
                wifiSpot.getWifiSpotId().getValue(),
                wifiSpot.getWifiSpotName().getValue(),
                wifiSpot.getWifiSpotDescription().getValue(),
                wifiSpot.getWifiSpotCoordinates().getLongitude(),
                wifiSpot.getWifiSpotCoordinates().getLatitude(),
                wifiSpot.getWifiSpotLocationType().getValue(),
                wifiSpot.getWifiSpotQualityIndicators().getWifiQuality(),
                wifiSpot.getWifiSpotQualityIndicators().getSignalStrength(),
                wifiSpot.getWifiSpotQualityIndicators().getBandwithLimitations(),
                wifiSpot.getWifiSpotQualityIndicators().getPeakUsageHourInterval().getStartTime(),
                wifiSpot.getWifiSpotQualityIndicators().getPeakUsageHourInterval().getEndTime(),
                wifiSpot.getWifiSpotEnvironmentalFeatures().isCrowded(),
                wifiSpot.getWifiSpotEnvironmentalFeatures().isCoveredArea(),
                wifiSpot.getWifiSpotEnvironmentalFeatures().isAirConditioning(),
                wifiSpot.getWifiSpotEnvironmentalFeatures().isOutdoorSeating(),
                wifiSpot.getWifiSpotEnvironmentalFeatures().isGoodView(),
                wifiSpot.getWifiSpotEnvironmentalFeatures().getNoiseLevel(),
                wifiSpot.getWifiSpotEnvironmentalFeatures().isPetFriendly(),
                wifiSpot.getWifiSpotEnvironmentalFeatures().isChildFriendly(),
                wifiSpot.getWifiSpotEnvironmentalFeatures().isDisabledAccess(),
                wifiSpot.getWifiSpotFacilities().isAvailablePowerOutlets(),
                wifiSpot.getWifiSpotFacilities().isChargingStations(),
                wifiSpot.getWifiSpotFacilities().isRestroomsAvailable(),
                wifiSpot.getWifiSpotFacilities().isParkingAvailability(),
                wifiSpot.getWifiSpotFacilities().isFoodOptions(),
                wifiSpot.getWifiSpotFacilities().isDrinkOptions(),
                wifiSpot.getWifiSpotWeatherFeatures().isOpenDuringRain(),
                wifiSpot.getWifiSpotWeatherFeatures().isOpenDuringHeat(),
                wifiSpot.getWifiSpotWeatherFeatures().isHeatedInWinter(),
                wifiSpot.getWifiSpotWeatherFeatures().isShadedAreas(),
                wifiSpot.getWifiSpotWeatherFeatures().isOutdoorFans(),
                wifiSpotAddressDomainToDto(wifiSpot.getWifiSpotAddress()),
                wifiSpot.getWifiSpotManagement().getValue()
        );
    }

    @Override
    public WifiSpot wifiSpotCreateDtoToDomain(WifiSpotCreateDto wifiSpotDto) {
        return new WifiSpot(
                new WifiSpotName(wifiSpotDto.wifiSpotName()),
                new WifiSpotDescription(wifiSpotDto.wifiSpotDescription()),
                new WifiSpotCoordinates(wifiSpotDto.longitude(), wifiSpotDto.latitude()),
                new WifiSpotLocationType(wifiSpotDto.locationType()),
                new WifiSpotQualityIndicators(
                        wifiSpotDto.qualityType(),
                        wifiSpotDto.strengthType(),
                        wifiSpotDto.bandwithType(),
                        new WifiSpotPeakUsageInterval(wifiSpotDto.startPeakUsageTime(), wifiSpotDto.endPeakUsageTime())
                ),
                new WifiSpotEnvironmentalFeatures(
                        wifiSpotDto.crowded(),
                        wifiSpotDto.coveredArea(),
                        wifiSpotDto.airConditioning(),
                        wifiSpotDto.outdoorSeating(),
                        wifiSpotDto.goodView(),
                        wifiSpotDto.noiseType(),
                        wifiSpotDto.petFriendly(),
                        wifiSpotDto.childFriendly(),
                        wifiSpotDto.disabledAccess()
                ),
                new WifiSpotFacilities(
                        wifiSpotDto.availablePowerOutlets(),
                        wifiSpotDto.chargingStations(),
                        wifiSpotDto.restroomsAvailable(),
                        wifiSpotDto.parkingAvailability(),
                        wifiSpotDto.foodOptions(),
                        wifiSpotDto.drinkOptions()
                ),
                new WifiSpotWeatherFeatures(
                        wifiSpotDto.openDuringRain(),
                        wifiSpotDto.openDuringHeat(),
                        wifiSpotDto.heatedInWinter(),
                        wifiSpotDto.shadedAreas(),
                        wifiSpotDto.outdoorFans()
                ),
                wifiSpotAddressCreateDtoToDomain(wifiSpotDto.wifiSpotAddressDto()),
                new WifiSpotManagement(
                        wifiSpotDto.wifiSpotManagementType()
                )
        );
    }

    @Override
    public WifiSpot wifiSpotDtoToDomain(WifiSpotDto wifiSpotDto) {
        return new WifiSpot(
                new WifiSpotId(wifiSpotDto.uuid()),
                new WifiSpotName(wifiSpotDto.wifiSpotName()),
                new WifiSpotDescription(wifiSpotDto.wifiSpotDescription()),
                new WifiSpotCoordinates(wifiSpotDto.longitude(), wifiSpotDto.latitude()),
                new WifiSpotLocationType(wifiSpotDto.locationType()),
                new WifiSpotQualityIndicators(
                        wifiSpotDto.qualityType(),
                        wifiSpotDto.strengthType(),
                        wifiSpotDto.bandwithType(),
                        new WifiSpotPeakUsageInterval(wifiSpotDto.startPeakUsageTime(), wifiSpotDto.endPeakUsageTime())
                ),
                new WifiSpotEnvironmentalFeatures(
                        wifiSpotDto.crowded(),
                        wifiSpotDto.coveredArea(),
                        wifiSpotDto.airConditioning(),
                        wifiSpotDto.outdoorSeating(),
                        wifiSpotDto.goodView(),
                        wifiSpotDto.noiseType(),
                        wifiSpotDto.petFriendly(),
                        wifiSpotDto.childFriendly(),
                        wifiSpotDto.disabledAccess()
                ),
                new WifiSpotFacilities(
                        wifiSpotDto.availablePowerOutlets(),
                        wifiSpotDto.chargingStations(),
                        wifiSpotDto.restroomsAvailable(),
                        wifiSpotDto.parkingAvailability(),
                        wifiSpotDto.foodOptions(),
                        wifiSpotDto.drinkOptions()
                ),
                new WifiSpotWeatherFeatures(
                        wifiSpotDto.openDuringRain(),
                        wifiSpotDto.openDuringHeat(),
                        wifiSpotDto.heatedInWinter(),
                        wifiSpotDto.shadedAreas(),
                        wifiSpotDto.outdoorFans()
                ),
                wifiSpotAddressDtoToDomain(wifiSpotDto.wifiSpotAddressDto()),
                new WifiSpotManagement(
                        wifiSpotDto.wifiSpotManagementType()
                )
        );
    }

    @Override
    public WifiSpotAddressDto wifiSpotAddressDomainToDto(WifiSpotAddress wifiSpotAddress) {
        return new WifiSpotAddressDto(
                wifiSpotAddress.getWifiSpotAddressId().getValue(),
                wifiSpotAddress.getWifiSpotAddressCountry().getValue(),
                wifiSpotAddress.getWifiSpotAddressZipCode().getValue(),
                wifiSpotAddress.getWifiSpotAddressLine1().getValue(),
                wifiSpotAddress.getWifiSpotAddressLine2().getValue(),
                wifiSpotAddress.getWifiSpotAddressCity().getValue(),
                wifiSpotAddress.getWifiSpotAddressDistrict().getValue()
        );
    }

    @Override
    public WifiSpotAddress wifiSpotAddressDtoToDomain(WifiSpotAddressDto wifiSpotAddressDto) {
        return new WifiSpotAddress(
                new WifiSpotAddressId(wifiSpotAddressDto.uuid()),
                new WifiSpotAddressCountry(wifiSpotAddressDto.country()),
                new WifiSpotAddressZipCode(wifiSpotAddressDto.zipCode()),
                new WifiSpotAddressLine1(wifiSpotAddressDto.addressLine1()),
                new WifiSpotAddressLine2(wifiSpotAddressDto.addressLine2()),
                new WifiSpotAddressCity(wifiSpotAddressDto.city()),
                new WifiSpotAddressDistrict(wifiSpotAddressDto.district())
        );
    }

    @Override
    public WifiSpotAddressCreateDto wifiSpotAddressDomainToCreateDto(WifiSpotAddress wifiSpotAddress) {
        return new WifiSpotAddressCreateDto(
                wifiSpotAddress.getWifiSpotAddressCountry().getValue(),
                wifiSpotAddress.getWifiSpotAddressZipCode().getValue(),
                wifiSpotAddress.getWifiSpotAddressLine1().getValue(),
                wifiSpotAddress.getWifiSpotAddressLine2().getValue(),
                wifiSpotAddress.getWifiSpotAddressCity().getValue(),
                wifiSpotAddress.getWifiSpotAddressDistrict().getValue()
        );
    }

    @Override
    public WifiSpotAddress wifiSpotAddressCreateDtoToDomain(WifiSpotAddressCreateDto wifiSpotAddressDto) {
        return new WifiSpotAddress(
                new WifiSpotAddressCountry(wifiSpotAddressDto.country()),
                new WifiSpotAddressZipCode(wifiSpotAddressDto.zipCode()),
                new WifiSpotAddressLine1(wifiSpotAddressDto.addressLine1()),
                new WifiSpotAddressLine2(wifiSpotAddressDto.addressLine2()),
                new WifiSpotAddressCity(wifiSpotAddressDto.city()),
                new WifiSpotAddressDistrict(wifiSpotAddressDto.district())
        );
    }
}
