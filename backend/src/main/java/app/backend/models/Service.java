package app.backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Service {

    @Id
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String thumbnail;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "original_price")
    private BigDecimal originalPrice;

    @Column(name = "discount_percent")
    private Integer discountPercent;

    @Column(name = "final_price")
    private BigDecimal finalPrice;

    @Column(name = "average_rating")
    private BigDecimal averageRating;

    @Column(name = "review_count")
    private Integer reviewCount;

    @Column(name = "booking_count")
    private Integer bookingCount;

    @Column(name = "is_featured")
    private Boolean featured;

    private String status;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @ElementCollection
    @CollectionTable(
        name = "service_images",
        joinColumns = @JoinColumn(name = "service_id")
    )
    @Column(name = "image_url")
    private Set<String> images;

    @ManyToMany(mappedBy = "services")
    private Set<Booking> bookings;

    @OneToMany(mappedBy = "service")
    private List<ServiceReview> serviceReviews;

    @OneToMany(mappedBy = "service")
    private List<ServiceImg> serviceImages;

}