package com.netquest.domain.wifispot.service;

import com.netquest.domain.user.model.User;

import java.util.List;
import java.util.Optional;

public interface WifiSpotService {

    List<User> getUsers();

    Optional<User> getUserByUsername(String username);

    boolean hasUserWithUsername(String username);

    boolean hasUserWithEmail(String email);

    User validateAndGetUserByUsername(String username);

    User saveUser(User user);

    void deleteUser(User user);

    Optional<User> validUsernameAndPassword(String username, String password);
}
