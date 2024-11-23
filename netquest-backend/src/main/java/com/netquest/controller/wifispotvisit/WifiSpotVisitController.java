package com.netquest.controller.wifispotvisit;


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

import java.util.UUID;

import static com.netquest.config.SwaggerConfig.BASIC_AUTH_SECURITY_SCHEME;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/wifi-spot-visit")
public class WifiSpotVisitController {
    private final WifiSpotVisitService wifiSpotVisitService;

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public WifiSpotVisitDto create(@Valid @RequestBody WifiSpotVisitCreateDto wifiSpotVisitCreateDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return wifiSpotVisitService.saveWifiSpotVisit(userDetails.getId(),wifiSpotVisitCreateDto);
    }

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/simple/{wifi-spot-id}")
    public WifiSpotVisitDto createSimple(@PathVariable(name = "wifi-spot-id") UUID wifiSpotUUID) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return wifiSpotVisitService.saveWifiSpotVisitSimple(userDetails.getId(),wifiSpotUUID);
    }

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.OK)
    @PatchMapping("/update-end-date-time/{id}")
    public WifiSpotVisitDto updateWifiSpotVisitEndDateTime(
            @PathVariable(name = "id") UUID wifiSpotVisitUUID,
            @Valid @RequestBody WifiSpotVisitUpdateDateTimeDto wifiSpotVisitUpdateDateTimeDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return wifiSpotVisitService.updateWifiSpotVisitEndDateTime(userDetails.getId() ,wifiSpotVisitUUID,wifiSpotVisitUpdateDateTimeDto);
    }

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/ongoing")
    public WifiSpotVisitDto getWifiSpotVisitOngoing() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return wifiSpotVisitService.getWifiSpotVisitOngoing(userDetails.getId());
    }

}
