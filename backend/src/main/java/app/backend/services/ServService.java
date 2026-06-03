package app.backend.services;

import org.springframework.stereotype.Service;
import java.util.List;

import app.backend.repositories.ServRepo;
import app.backend.models.ServEntity;

@Service
public class ServService {
    private final ServRepo serviceRepo;

    public ServService(ServRepo serviceRepo){
        this.serviceRepo = serviceRepo;
    }

    public List<ServEntity> getAllEnableService(){
        return serviceRepo.findAllEnable();
    }
    
    public ServEntity getEnableServById(Long id){
        return serviceRepo.findByIdAndEnable(id);
    }
    
}
