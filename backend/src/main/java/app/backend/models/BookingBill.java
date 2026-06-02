package app.backend.models;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "booking_bills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingBill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private ServEntity service;

    // private Integer serviceAmount;
}
