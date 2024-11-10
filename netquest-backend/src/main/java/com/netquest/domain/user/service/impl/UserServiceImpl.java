package com.netquest.domain.user.service.impl;

import com.netquest.domain.user.model.UserId;
import com.netquest.domain.user.service.UserService;
import com.netquest.domain.user.exception.UserNotFoundException;
import com.netquest.domain.user.model.User;
import com.netquest.infrastructure.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public boolean hasUserWithUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean hasUserWithEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public User validateAndGetUserByUsername(String username) {
        return getUserByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(String.format("User with username %s not found", username)));
    }

    @Override
    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    @Override
    public void deleteUserById(UUID userUUID) {
        UserId userId = new UserId(userUUID);
        userRepository.deleteById(userId);
    }

    @Override
    public User getUserById(UUID userUUID) {
        UserId userId = new UserId(userUUID);
        return userRepository.findById(userId).orElseThrow();
    }

    @Override
    public Optional<User> validUsernameAndPassword(String username, String password) {
        return getUserByUsername(username)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()));
    }

    @Override
    public boolean existsById(UUID userUUID) {
        UserId userId = new UserId(userUUID);
        return userRepository.existsById(userId);
    }
}
