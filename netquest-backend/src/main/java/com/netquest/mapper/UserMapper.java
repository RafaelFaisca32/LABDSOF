package com.netquest.mapper;

import com.netquest.model.User;
import com.netquest.controller.dto.UserDto;

public interface UserMapper {

    UserDto toUserDto(User user);
}