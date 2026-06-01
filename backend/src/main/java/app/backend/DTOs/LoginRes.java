package app.backend.DTOs;

import app.backend.models.User;


public class LoginRes {
    private String token;
    private String username;
    private String avatarUrl;
    private String role; 
    
    public LoginRes(User account, String token) {
        this.token = token;
        this.username = account.getUsername();
        this.role = account.getRole() != null ? account.getRole().getName() : null;
        this.avatarUrl = account.getAvatarUrl();
    }

    // Getters
    public String getToken() { return token; }
    public String getUsername() { return username; }
    public String getAvatarUrl() { return avatarUrl; }
    public String getRole() { return role; }
}