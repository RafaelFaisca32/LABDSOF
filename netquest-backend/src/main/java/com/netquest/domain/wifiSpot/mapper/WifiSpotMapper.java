package com.netquest.domain.wifiSpot.mapper;

import com.netquest.domain.user.model.User;
import com.netquest.domain.user.dto.UserDto;
import com.netquest.domain.wifiSpot.dto.WifiSpotDto;

public interface WifiSpotMapper {

    WifiSpotDto toWifiSpotDto(User user);
}