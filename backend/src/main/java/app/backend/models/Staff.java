package app.backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "staffs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Staff extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String phone;

    @Column(columnDefinition = "TEXT")
    private String avatar;

    private String gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    private String address;

    @Column(name = "hire_date")
    private LocalDate hireDate;

    private BigDecimal salary;

    @Column(name = "experience_years")
    private Integer experienceYears;

    private BigDecimal rating;

    @Column(name = "total_reviews")
    private Integer totalReviews;

    @Column(name = "working_start")
    private LocalTime workingStart;

    @Column(name = "working_end")
    private LocalTime workingEnd;

    @OneToMany(mappedBy = "staff")
    private List<Booking> bookings;
}
