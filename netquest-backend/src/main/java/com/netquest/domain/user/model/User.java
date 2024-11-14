package com.netquest.domain.user.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
public class User {

    @EmbeddedId
    @AttributeOverrides({
            @AttributeOverride( name = "value", column = @Column(name = "user_id"))
    })
    private UserId userId;

    private String username;
    private String password;
    private String name;
    private String email;
    private String role;

    public User(String username, String password, String name, String email, String role) {
        this.userId = new UserId();
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}
