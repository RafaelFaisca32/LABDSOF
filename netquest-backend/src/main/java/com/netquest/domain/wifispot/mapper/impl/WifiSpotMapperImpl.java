package com.netquest.domain.wifispot.mapper.impl;

import com.netquest.domain.user.mapper.UserMapper;
import com.netquest.domain.user.model.User;
import com.netquest.domain.user.dto.UserDto;
import com.netquest.domain.wifispot.dto.WifiSpotDto;
import com.netquest.domain.wifispot.mapper.WifiSpotMapper;
import org.springframework.stereotype.Service;

@Service
public class WifiSpotMapperImpl implements WifiSpotMapper {

    @Override
    public WifiSpotDto toWifiSpotDto(User user) {
        return new WifiSpotDto();
    }
}
