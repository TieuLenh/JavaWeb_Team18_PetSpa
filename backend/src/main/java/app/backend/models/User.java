package app.backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

import app.backend.enums.Gender;
import app.backend.enums.UserStatus;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity { // ke thua base entity de co create_at va update_at

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 20)
    private UserStatus status;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "username", length = 100)
    private String username;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(name = "gender", length = 100)
    private Gender gender;

    @Column(length = 20)
    private String phoneNumber;

    @Column(columnDefinition = "TEXT")
    private String avatarUrl;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;


    // mapping table
    @Column(length = 255)
    private String address;

    @OneToOne(mappedBy = "user")
    private Staff staff;

    @OneToMany(mappedBy = "owner")
    private List<Pet> pets;

    @OneToMany(mappedBy = "customer")
    private List<Order> orders;

    @OneToMany(mappedBy = "customer")
    private List<Booking> bookings;

    @OneToMany(mappedBy = "customer")
    private List<ProductReview> productReviews;

    @OneToMany(mappedBy = "customer")
    private List<ServiceReview> serviceReviews;

    @OneToMany(mappedBy = "user")
    private List<Notification> notifications;

    @OneToOne(mappedBy = "user")
    private Cart cart;
}