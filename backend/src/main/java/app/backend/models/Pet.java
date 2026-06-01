package app.backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "pets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pet {

    @Id
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "species_id")
    private Species species;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String thumbnail;

    private String breed;

    private String gender;

    private Integer age;

    private LocalDate birthday;

    @Column(name = "weight_kg")
    private BigDecimal weightKg;

    private String color;

    @Column(name = "microchip_code", unique = true)
    private String microchipCode;

    @Column(columnDefinition = "TEXT")
    private String personality;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(columnDefinition = "TEXT")
    private String note;

    private String status;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @ElementCollection
    @CollectionTable(
        name = "pet_images",
        joinColumns = @JoinColumn(name = "pet_id")
    )
    @Column(name = "image_url")
    private Set<String> images;

    @OneToMany(mappedBy = "pet")
    private List<Booking> bookings;
    
    @OneToMany(mappedBy = "pet")
    private List<PetImg> petImages;
}