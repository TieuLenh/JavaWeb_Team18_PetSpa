package app.backend.security;

import app.backend.models.User;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;


@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String SECRET;

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    // =========================
    // 1. GENERATE TOKEN (Nhận tham số là User)
    // =========================
    public String genAccessToken(User user) {
        // Tự động chuyển đổi Set<Role> thành List<String> chứa tên các role
        String role = user.getRole() != null ? user.getRole().getName() : null;

        return Jwts.builder()
                .setSubject(String.valueOf(user.getId())) 
                .claim("role", role)                       
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7) // 7 ngày
                )
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // =========================
    // 2. EXTRACT USER ID
    // =========================
    public Long extractUserId(String token) {
        Claims claims = getAllClaims(token);
        return Long.parseLong(claims.getSubject());
    }

    // =========================
    // 3. EXTRACT ROLES
    // =========================

    public String extractRole(String token) {
        Claims claims = getAllClaims(token);
        return claims.get("role", String.class);
    }

    // =========================
    // 4. COMMON METHOD
    // =========================
    private Claims getAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isValid(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSignKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            System.out.println("Invalid JWT: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println("Token is null or empty");
        }
        return false;
    }
}