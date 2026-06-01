package app.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
        // 1. Cấu hình quét file .env một cách thông minh
        Dotenv dotenv = Dotenv.configure()
                .directory("./") // quét env tại thư mục gốc của project
                .ignoreIfMissing() // Nếu không thấy ở đây thì bỏ qua, không ném lỗi sập app
                .load();
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });

        // 2. Nếu ở trên vẫn hụt (do đứng ở thư mục con), quét thêm 1 lần nữa ở thư mục hiện tại của module backend
        Dotenv dotenvServer = Dotenv.configure()
                .directory("./backend") // Đường dẫn tương đối vào module backend
                .ignoreIfMissing()
                .load();
        dotenvServer.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });

        // Sau khi các biến môi trường đã được nạp vào RAM hệ thống, mới cho Spring chạy
        SpringApplication.run(BackendApplication.class, args);
    }
}