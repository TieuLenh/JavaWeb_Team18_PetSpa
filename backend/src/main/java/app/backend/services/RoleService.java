package app.backend.services;

import org.springframework.stereotype.Service;

import app.backend.models.Role;
import app.backend.repositories.RoleRepo;


@Service
public class RoleService {
    
    // KHẮC PHỤC: Bỏ static, sử dụng final để đảm bảo tính bất biến và an toàn luồng (Thread-safe)
    private final RoleRepo roleRepo;
    
    public RoleService(RoleRepo roleRepo) {
        this.roleRepo = roleRepo;
    }

    public Role getDefaultRole() {
        return roleRepo.findByName("USER");
    }
}