package com.example.board.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.board.dto.UserDto;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserDto userDto) {
        System.out.println("회원가입 요청됨: " + userDto.getUsername());
        // 여기에 회원가입 처리 로직 (예: DB 저장 등) 추가 가능
        return ResponseEntity.ok("회원가입 완료");
    }
}
