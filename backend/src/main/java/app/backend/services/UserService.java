package app.backend.services;

import org.springframework.stereotype.Service;

import app.backend.enums.UserStatus;
import app.backend.models.Role;
import app.backend.models.User;
import app.backend.repositories.UserRepo;


import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@Service
public class UserService {
    private final UserRepo userRepo;
    
    // Giả sử bạn có RoleService hoặc tương đương để lấy Role mặc định từ DB
    private final RoleService roleService; 
    
    public UserService(UserRepo userRepo, RoleService roleService) {
        this.userRepo = userRepo;
        this.roleService = roleService;
    }

    private final BCryptPasswordEncoder pwEncoder = new BCryptPasswordEncoder();

    // =========================
    // LOGIC ĐĂNG KÝ
    // =========================
    public User register(String email, String password) {
        if (userRepo.existsByEmail(email)) {
            return null;
        }

        User user = new User();
        user.setEmail(email);
        user.setUsername(user.getEmail().split("@")[0]);
        user.setPassword(pwEncoder.encode(password));
        user.setStatus(UserStatus.ACTIVATED);

        // KHẮC PHỤC: Tạo Set<Role> và nạp Role mặc định (ví dụ: "USER") vào danh sách
        Role userRole = roleService.getDefaultRole();
        user.setRole(userRole);

        userRepo.save(user);
        return user;
    }

    // =========================
    // LOGIC ĐĂNG NHẬP
    // =========================
    public User login(String email, String password) {
        User user = userRepo.findByEmail(email);
        if (user != null && pwEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    public java.util.List<User> getAllUsers() {
        return userRepo.findAll();
    }

    // Lấy thông tin tài khoản bằng ID (Phục vụ cho API /auth/me thông qua ID lấy từ JWT)
    public User getUserById(Long id) {
        return userRepo.findById(id).orElse(null);
    }

    public User getProfile(String email) {
        return userRepo.findByEmail(email);
    }
}