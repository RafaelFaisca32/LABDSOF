package com.netquest.controller.wifispotvisit;


import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitCreateDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitDto;
import com.netquest.domain.wifispotvisit.dto.WifiSpotVisitUpdateDateTimeDto;
import com.netquest.domain.wifispotvisit.service.WifiSpotVisitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
        return wifiSpotVisitService.saveWifiSpotVisit(wifiSpotVisitCreateDto);
    }

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.CREATED)
    @PatchMapping("/update-end-date-time/{id}")
    public WifiSpotVisitDto updateWifiSpotVisitEndDateTime(
            @PathVariable UUID id,
            @Valid @RequestBody WifiSpotVisitUpdateDateTimeDto wifiSpotVisitUpdateDateTimeDto) {
        return wifiSpotVisitService.updateWifiSpotVisitEndDateTime(id,wifiSpotVisitUpdateDateTimeDto);
    }

}
