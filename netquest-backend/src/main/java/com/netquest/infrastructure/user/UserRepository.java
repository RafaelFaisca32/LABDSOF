package com.netquest.infrastructure.user;

import com.netquest.domain.user.model.User;
import com.netquest.domain.user.model.UserId;
import com.netquest.domain.user.model.UserMail;
import com.netquest.domain.user.model.Username;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, UserId> {

    Optional<User> findByUsername(Username username);

    Optional<User> findById(UserId id);

    boolean existsByUsername(Username username);

    boolean existsByEmail(UserMail email);
}
