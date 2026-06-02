package app.backend.controllers;

import app.backend.DTOs.ServRes;
import app.backend.models.ServEntity;
import app.backend.services.ServService;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/service")
public class ServController {
    private final ServService servService;

    public ServController(ServService servService) {
        this.servService = servService;
    }

    @GetMapping
    public List<ServRes> getAllService(){
        List<ServEntity> servs = servService.getAllEnableService();
        return servs.stream().map(serv -> new ServRes(serv)).toList();
    }

}
