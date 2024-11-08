package com.netquest.domain.user.mapper.impl;

import com.netquest.domain.user.mapper.UserMapper;
import com.netquest.domain.user.model.User;
import com.netquest.domain.user.dto.UserDto;
import org.springframework.stereotype.Service;

@Service
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDto toUserDto(User user) {
        if (user == null) {
            return null;
        }
        return new UserDto(user.getId(), user.getUsername(), user.getName(), user.getEmail(), user.getRole());
    }
}
