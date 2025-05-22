package com.example.board.controller;

import com.example.board.domain.User;
import com.example.board.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.Optional;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // ✅ 회원가입: alias 항상 숫자 붙이기 ("바텐더1"부터 시작)
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");
        String baseAlias = payload.get("selectedTheme");

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body("이미 존재하는 사용자입니다.");
        }

        // 기존 alias 목록 조회
        List<User> existingUsers = userRepository.findByAliasStartingWith(baseAlias);

        // 최대 숫자 추출
        int maxIndex = existingUsers.stream()
                .map(User::getAlias)
                .map(alias -> alias.replace(baseAlias, "")) // "바텐더2" → "2"
                .filter(suffix -> suffix.matches("\\d+"))    // 숫자인 것만 필터
                .mapToInt(Integer::parseInt)
                .max()
                .orElse(0); // 없으면 0

        // 항상 숫자 붙여서 시작 (바텐더1부터)
        String alias = baseAlias + (maxIndex + 1);

        User user = new User(username, password);
        user.setAlias(alias);
        userRepository.save(user);

        return ResponseEntity.ok("회원가입 성공 (" + alias + ")");
    }

    // ✅ 로그인: 유저 전체 객체 반환
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
