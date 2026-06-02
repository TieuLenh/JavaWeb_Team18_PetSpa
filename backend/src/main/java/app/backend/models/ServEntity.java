package app.backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import app.backend.enums.ServStatus;

@Entity
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServEntity extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private ServCategory category;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "booking_count")
    private Integer bookingCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ServStatus status;

    @OneToMany(mappedBy = "service")
    @JsonIgnore
    private List<BookingBill> BookingServs;

    @OneToMany(mappedBy = "service")
    private List<ServiceReview> serviceReviews;

    @OneToMany(mappedBy = "service")
    private List<ServiceImg> serviceImages;


}