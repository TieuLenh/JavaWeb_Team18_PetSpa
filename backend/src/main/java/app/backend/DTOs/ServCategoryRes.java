package app.backend.DTOs;

import app.backend.models.ServCategory;
import lombok.Getter;

@Getter
public class ServCategoryRes {
    private Long id;
    private String name;

    public ServCategoryRes(ServCategory servCtgr){
        this.id = servCtgr.getId();
        this.name = servCtgr.getName();
    }
}
