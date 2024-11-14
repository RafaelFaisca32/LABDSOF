package com.netquest.domain.wifispot.mapper;

import com.netquest.domain.user.model.User;
import com.netquest.domain.wifispot.dto.WifiSpotDto;

public interface WifiSpotMapper {

    WifiSpotDto toWifiSpotDto(User user);
}