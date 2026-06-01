package app.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import app.backend.models.Role;

@Repository
public interface RoleRepo extends JpaRepository<Role, Long> {
    // Tìm kiếm account bằng email để phục vụ đăng nhập
    Role findByName(String name);
}