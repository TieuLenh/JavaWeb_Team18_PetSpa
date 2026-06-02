package app.backend.configs;


import app.backend.security.JwtAuthFilter;
import app.backend.security.JwtUtil;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    public SecurityConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        JwtAuthFilter jwtFilter = new JwtAuthFilter(jwtUtil);

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            // .cors(cors -> cors.configurationSource(request -> {
            //     CorsConfiguration config = new CorsConfiguration();
            //     config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
            //     config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
            //     config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
            //     config.setAllowCredentials(true); 
            //     return config; // phan nay toi them vao giong nghiep vu cua CorsConfig co le phai xem lai sau
            // }))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll() // co the custom cho nay de gioi han quyen truy cap api
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}