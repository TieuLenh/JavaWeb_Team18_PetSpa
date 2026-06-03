package app.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import app.backend.models.ServEntity;

@Repository
public interface ServRepo extends JpaRepository<ServEntity , Long>{
    @Query(value = "SELECT * FROM services WHERE status = 'ENABLE'", nativeQuery = true)
    public List<ServEntity> findAllEnable(); 

    @Query(value = "SELECT * FROM services WHERE status = 'ENABLE' AND id = :id", nativeQuery = true)
    public ServEntity findByIdAndEnable(@Param(value ="id") Long id);
}
