package app.backend.repositories;

import app.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    // Tìm kiếm account bằng email để phục vụ đăng nhập
    User findByEmail(String email);

    // Kiểm tra xem email đã tồn tại chưa để phục vụ đăng ký
    boolean existsByEmail(String email);

    // Kiểm tra xem username đã tồn tại chưa
    boolean existsByUsername(String username);

    void deleteByEmail(String email);
}
