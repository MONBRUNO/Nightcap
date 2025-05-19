package com.example.board.controller;

import com.example.board.domain.User;
import com.example.board.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // ✅ 회원가입: alias 중복 검사 후 자동 번호 붙이기
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");
        String baseAlias = payload.get("selectedTheme");

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body("이미 존재하는 사용자입니다.");
        }

        // alias 자동 중복 처리
        String alias = baseAlias;
        int count = 1;
        while (userRepository.existsByAlias(alias)) {
            alias = baseAlias + count;
            count++;
        }

        User user = new User(username, password);
        user.setAlias(alias);
        userRepository.save(user);

        return ResponseEntity.ok("회원가입 성공 (" + alias + ")");
    }

    // ✅ 로그인: 유저 전체 객체 반환 (id, alias 등)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> foundUser = userRepository.findByUsername(loginRequest.getUsername());

        if (foundUser.isPresent() &&
                foundUser.get().getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.ok(foundUser.get());
        }

        return ResponseEntity.status(401).body("로그인 실패");
    }
}
