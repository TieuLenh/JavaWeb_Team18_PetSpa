package app.backend.DTOs;

import java.math.BigDecimal;

import app.backend.models.ServEntity;
import app.backend.models.ServiceImg;
import app.backend.models.ServiceReview;
import lombok.Getter;


@Getter
public class ServCardRes {
    private Long id;
    private String category;
    private String name;
    private String desciption;
    private Integer durationMinutes;
    private BigDecimal price;
    private double averageRating;
    private String thumbnailUrl;

    public ServCardRes(ServEntity serv){
        this.id = serv.getId();
        this.category = serv.getCategory() != null ? serv.getCategory().getName() != null ? "OK" : serv.getCategory().getName() : "OK"; // de tranh null exception thoi
        this.name = serv.getName();
        this.desciption = serv.getDescription();
        this.durationMinutes = serv.getDurationMinutes();
        this.price = serv.getPrice();
        int reviewCount = serv.getServiceReviews().size();
        this.averageRating = reviewCount == 0
                ? 0.0
                : (double) serv.getServiceReviews()
                        .stream()
                        .mapToInt(ServiceReview::getStars)
                        .sum()
                / reviewCount;
        this.thumbnailUrl = serv.getServiceImages()
                                    .stream()
                                    .filter(ServiceImg::getIsThumbnail)
                                    .map(ServiceImg::getImageUrl)
                                    .findFirst()
                                    .orElse(null);
    }
}
