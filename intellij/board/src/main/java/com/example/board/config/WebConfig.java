package com.example.board.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // 모든 API
                .allowedOrigins("http://localhost:3000")  // React 포트
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // 필요한 메서드
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
