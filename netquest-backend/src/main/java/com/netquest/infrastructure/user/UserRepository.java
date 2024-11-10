package com.netquest.infrastructure.user;

import com.netquest.domain.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findById(String id);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
