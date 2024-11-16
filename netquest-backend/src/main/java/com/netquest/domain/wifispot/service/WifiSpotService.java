package com.netquest.domain.wifispot.service;

import com.netquest.domain.user.model.User;
import com.netquest.domain.wifispot.dto.WifiSpotCreateDto;
import com.netquest.domain.wifispot.dto.WifiSpotDto;
import com.netquest.domain.wifispot.model.WifiSpot;

import java.util.List;
import java.util.Optional;

public interface WifiSpotService {
    List<WifiSpotDto> getWifiSpots();

    WifiSpotDto createWifiSpot(WifiSpotCreateDto wifiSpotDto);
}
