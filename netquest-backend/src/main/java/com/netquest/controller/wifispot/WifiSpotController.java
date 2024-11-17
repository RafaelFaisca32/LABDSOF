package com.netquest.controller.wifispot;


import com.netquest.domain.shared.WifiSpotManagementType;
import com.netquest.domain.wifispot.dto.WifiSpotCreateDto;
import com.netquest.domain.wifispot.dto.WifiSpotDto;
import com.netquest.domain.wifispot.service.WifiSpotService;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitCreateDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitUpdateDateTimeDto;
import com.netquest.domain.wifispotvisit.service.WifiSpotVisitService;
import com.netquest.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static com.netquest.config.SwaggerConfig.BASIC_AUTH_SECURITY_SCHEME;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/wifi-spot")
public class WifiSpotController {
    private final WifiSpotService wifiSpotService;

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public WifiSpotDto create(@Valid @RequestBody WifiSpotCreateDto wifiSpotCreateDto) {
        WifiSpotCreateDto updatedDto = new WifiSpotCreateDto(
                wifiSpotCreateDto.name(),
                wifiSpotCreateDto.description(),
                wifiSpotCreateDto.latitude(),
                wifiSpotCreateDto.longitude(),
                wifiSpotCreateDto.locationType(),
                wifiSpotCreateDto.wifiQuality(),
                wifiSpotCreateDto.signalStrength(),
                wifiSpotCreateDto.bandwidth(),
                wifiSpotCreateDto.peakUsageStart(),
                wifiSpotCreateDto.peakUsageEnd(),
                wifiSpotCreateDto.crowded(),
                wifiSpotCreateDto.coveredArea(),
                wifiSpotCreateDto.airConditioning(),
                wifiSpotCreateDto.outdoorSeating(),
                wifiSpotCreateDto.goodView(),
                wifiSpotCreateDto.noiseLevel(),
                wifiSpotCreateDto.petFriendly(),
                wifiSpotCreateDto.childFriendly(),
                wifiSpotCreateDto.disableAccess(),
                wifiSpotCreateDto.availablePowerOutlets(),
                wifiSpotCreateDto.chargingStations(),
                wifiSpotCreateDto.restroomsAvailable(),
                wifiSpotCreateDto.parkingAvailability(),
                wifiSpotCreateDto.foodOptions(),
                wifiSpotCreateDto.drinkOptions(),
                wifiSpotCreateDto.openDuringRain(),
                wifiSpotCreateDto.openDuringHeat(),
                wifiSpotCreateDto.heatedInWinter(),
                wifiSpotCreateDto.shadedAreas(),
                wifiSpotCreateDto.outdoorFans(),
                wifiSpotCreateDto.address(),
                WifiSpotManagementType.UNVERIFIED
        );
        return wifiSpotService.createWifiSpot(updatedDto);
    }

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.OK)
    @GetMapping
    public List<WifiSpotDto> getAll() {
        return wifiSpotService.getWifiSpots();
    }
}
