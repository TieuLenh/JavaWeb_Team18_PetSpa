package app.backend.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "staff_specialties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffSpecialty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "staff_specialty_id")
    private Long staffSpecialtyId;

    @Column(nullable = false, length = 100)
    private String specialty;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;
}