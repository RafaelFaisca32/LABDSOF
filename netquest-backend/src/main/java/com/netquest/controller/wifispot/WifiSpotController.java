package com.netquest.controller.wifispot;


import com.netquest.domain.shared.WifiSpotManagementType;
import com.netquest.domain.user.dto.UserDto;
import com.netquest.domain.user.mapper.UserMapper;
import com.netquest.domain.user.mapper.impl.UserMapperImpl;
import com.netquest.domain.user.model.User;
import com.netquest.domain.user.service.UserService;
import com.netquest.domain.wifispot.dto.WifiSpotCreateDto;
import com.netquest.domain.wifispot.dto.WifiSpotDto;
import com.netquest.domain.wifispot.dto.WifiSpotFilterDto;
import com.netquest.domain.wifispot.service.WifiSpotService;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitCreateDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitUpdateDateTimeDto;
import com.netquest.domain.wifispotvisit.service.WifiSpotVisitService;
import com.netquest.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Null;
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
    private final UserService userService;
    private final UserMapper userMapper;

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

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();


        return wifiSpotService.createWifiSpot(updatedDto, userDetails.getId());
    }

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.OK)
    @GetMapping
    public List<WifiSpotDto> getAll() {
        return wifiSpotService.getWifiSpots();
    }

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path = "/getAIWifiSpots")
    public List<WifiSpotDto> getWifiSpotIA(@RequestParam(required = false) String request) {
        return wifiSpotService.getWifiSpotsIA(request);
    }

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @GetMapping(path = "/getFilteredWifiSpots")
    @ResponseStatus(HttpStatus.OK)
    public List<WifiSpotDto> getFilteredWifiSpots(
        @RequestParam(required = false) String name,
        @RequestParam(required = false) Boolean exactName,
        @RequestParam(required = false) String description,
        @RequestParam(required = false) Boolean exactDescription,
        @RequestParam(required = false) String locationType,
        @RequestParam(required = false) String wifiQuality,
        @RequestParam(required = false) String signalStrength,
        @RequestParam(required = false) String bandwidth,
        @RequestParam(required = false) Boolean crowded,
        @RequestParam(required = false) Boolean coveredArea,
        @RequestParam(required = false) Boolean airConditioning,
        @RequestParam(required = false) Boolean goodView,
        @RequestParam(required = false) String noiseLevel,
        @RequestParam(required = false) Boolean petFriendly,
        @RequestParam(required = false) Boolean childFriendly,
        @RequestParam(required = false) Boolean disableAccess,
        @RequestParam(required = false) Boolean availablePowerOutlets,
        @RequestParam(required = false) Boolean chargingStations,
        @RequestParam(required = false) Boolean restroomsAvailable,
        @RequestParam(required = false) Boolean parkingAvailability,
        @RequestParam(required = false) Boolean foodOptions,
        @RequestParam(required = false) Boolean drinkOptions,
        @RequestParam(required = false) Boolean openDuringRain,
        @RequestParam(required = false) Boolean openDuringHeat,
        @RequestParam(required = false) Boolean heatedInWinter,
        @RequestParam(required = false) Boolean shadedAreas,
        @RequestParam(required = false) Boolean outdoorFans
    ) {
        return wifiSpotService.getFilteredWifiSpots(
            name, exactName, description, exactDescription,
            locationType, wifiQuality, signalStrength, bandwidth,
            crowded, coveredArea, airConditioning, goodView,
            noiseLevel, petFriendly, childFriendly, disableAccess,
            availablePowerOutlets, chargingStations, restroomsAvailable,
            parkingAvailability, foodOptions, drinkOptions,
            openDuringRain, openDuringHeat, heatedInWinter,
            shadedAreas, outdoorFans
        );
    }
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @PostMapping(path = "/search-wifi-spots")
    @ResponseStatus(HttpStatus.OK)
    public List<WifiSpotDto> searchWifiSpots(
            @RequestBody(required = false) WifiSpotFilterDto wifiSpotFilterDto
    ) {
        return wifiSpotService.getWifiSpotsWithFilters(wifiSpotFilterDto);
    }

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @PostMapping(path = "/search-wifi-spots-by-user")
    @ResponseStatus(HttpStatus.OK)
    public List<WifiSpotDto> searchWifiSpotsByUser(
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userService.getUserById(userDetails.getId());
        return wifiSpotService.getWifiSpotsOfUser(userMapper.toUserDto(user));
    }
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/{uuid}")
    public WifiSpotDto updateWifiSpot(
        @PathVariable UUID uuid,
        @Valid @RequestBody WifiSpotDto wifiSpotDto
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        // Ensure only the owner or authorized users can update the Wi-Fi spot
        wifiSpotService.verifyOwnershipOrPermission(uuid, userDetails.getId());

        // Perform the update and return the updated Wi-Fi spot details
        return wifiSpotService.updateWifiSpot(uuid, wifiSpotDto);
    }
}
