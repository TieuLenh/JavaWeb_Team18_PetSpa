package app.backend.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "service_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceImg {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_image_id")
    private Long serviceImageId;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "is_thumbnail")
    @Builder.Default
    private Boolean isThumbnail = false;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;
}