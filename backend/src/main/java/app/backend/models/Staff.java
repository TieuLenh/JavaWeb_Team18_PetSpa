package app.backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "staffs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Staff {

    @Id
    private Integer id;

    @OneToOne
    @JoinColumn(name = "account_id", unique = true)
    private Account account;

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

    @Column(name = "created_at")
    private Timestamp createdAt;

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @ElementCollection
    @CollectionTable(
        name = "staff_specialties",
        joinColumns = @JoinColumn(name = "staff_id")
    )
    @Column(name = "specialty_name")
    private Set<String> specialties;

    @OneToMany(mappedBy = "groomer")
    private List<Booking> bookings;

    @OneToMany(mappedBy = "groomer")
    private List<TimeSlot> timeSlots;
}
