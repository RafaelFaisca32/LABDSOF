package com.netquest.domain.user.dto;

import java.util.UUID;

public record UserDto(UUID id, String username, String name, String email, String role) {
}