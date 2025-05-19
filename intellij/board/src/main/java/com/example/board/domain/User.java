package com.example.board.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "users") // "user"는 예약어라서 "users" 추천
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username; // ✅ username이 빠져 있었음!

    @Column(unique = true)
    private String alias; // ✅ 테마 닉네임 (예: 밤손님1)

    private String password;

    public User() {}

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // ✅ Getter / Setter

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
