package app.backend.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import app.backend.models.User;

import app.backend.DTOs.UserProfileRes;
import app.backend.DTOs.LoginRes;
import app.backend.DTOs.Response;
import app.backend.DTOs.AuthRequest;

import app.backend.security.JwtUtil;
import app.backend.services.UserService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService UserService;

    public AuthController(UserService UserService) {
        this.UserService = UserService;
    }
    @Autowired
    private JwtUtil jwtUtil;

    // 1. API ĐĂNG NHẬP
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest loginRequest) {
        System.out.println("Email: " + loginRequest.getEmail());
        System.out.println("Password: " + loginRequest.getPassword());

        User User = UserService.login(loginRequest.getEmail(), loginRequest.getPassword());

        if (User != null) {
            if ("ACTIVATED".equals(User.getStatus())) {
                String token = jwtUtil.genAccessToken(User);
                LoginRes loginData = new LoginRes(User, token);
                return ResponseEntity.ok(
                    new Response<LoginRes> (
                        true,
                        "Đăng nhập thành công!",
                        loginData
                    )
                );
            } else {
                return ResponseEntity.status(401).body(
                    new Response<>( 
                            false,
                            "Your User is " + User.getStatus().name().toLowerCase(),
                            null
                        )
                );
            }

        } else {
            return ResponseEntity.status(401).body(new Response<>(false, "Sai tài khoản hoặc mật khẩu", null));
        }
    }

    // 2. API ĐĂNG KÝ
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest registerRequest) {
        User User = UserService.register(registerRequest.getEmail(), registerRequest.getPassword());
        if (User != null) {
            String token = jwtUtil.genAccessToken(User);
            LoginRes loginData = new LoginRes(User, token); 
            return ResponseEntity.ok(new Response<LoginRes>(true, "Đăng ký thành công!", loginData));
        }
        return ResponseEntity.badRequest().body(new Response<>(false, "Email already in use!", null));
    }

    // 3. API LẤY THÔNG TIN TÀI KHOẢN (Đã hoàn thiện)
    @GetMapping("/me")
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            if (jwtUtil.isValid(token)) {
                // Trích xuất User ID được cấu hình trong Payload của Token
                Long UserId = jwtUtil.extractUserId(token);
                User User = UserService.getUserById(UserId);

                if (User != null) {
                    UserProfileRes userResponse = new UserProfileRes(User);
                    return ResponseEntity.ok(new Response<>(true, "Lấy thông tin thành công!", userResponse));
                }
            }
        }

        return ResponseEntity.status(401).body(new Response<>(false, "Chưa xác thực hoặc Token không hợp lệ", null));
    }
}
