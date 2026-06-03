package app.backend.controllers;

import app.backend.DTOs.ServCardRes;
import app.backend.DTOs.ServDetailRes;
import app.backend.models.ServEntity;
import app.backend.services.ServService;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/services")
public class ServController {
    private final ServService servService;

    public ServController(ServService servService) {
        this.servService = servService;
    }

    @GetMapping
    public List<ServCardRes> getAllService(){
        List<ServEntity> servs = servService.getAllEnableService();
        return servs.stream().map(serv -> new ServCardRes(serv)).toList();
    }

    @GetMapping("/{id}")
    public ServDetailRes getServiceById(@PathVariable Long id){
        return new ServDetailRes(servService.getEnableServById(id));
    }

}
