package app.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import app.backend.models.Booking;

public interface BookingRepo extends JpaRepository<Booking, Long>{
    
}
