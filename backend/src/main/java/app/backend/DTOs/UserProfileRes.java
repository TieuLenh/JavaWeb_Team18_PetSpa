package app.backend.DTOs;

import app.backend.models.User;
import app.backend.enums.Gender;

public class UserProfileRes {
    // Thuộc tính từ user
    private String username;
    private String email;

    // Thuộc tính từ Profile
    private String avatarUrl;
    private String fullName;
    private String phoneNumber;
    private String address;
    private Gender gender;

    // Constructor nhận vào user để tự động mapping phẳng dữ liệu cá nhân
    public UserProfileRes(User user) {
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.avatarUrl = user.getAvatarUrl();
        this.fullName = user.getFullName();
        this.phoneNumber = user.getPhoneNumber();
        this.address = user.getAddress();
        this.gender = user.getGender();
    }

    // Getters
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getAvatarUrl() { return avatarUrl; }
    public String getFullName() { return fullName; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getAddress() { return address; }
    public Gender getGender() { return gender; }
}