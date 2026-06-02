package app.backend.DTOs;

import java.math.BigDecimal;
import java.util.List;

import app.backend.models.ServEntity;
import app.backend.models.ServiceImg;
import app.backend.models.ServiceReview;
import lombok.Getter;

@Getter
public class ServRes {
    private Long id;
    private String category;
    private String name;
    private String desciption;
    private Integer durationMinutes;
    private BigDecimal price;
    private double averageRating;
    private Integer bookingCount;
    private String thumbnailUrl;
    private List<String> imgUrls;
    private List<ServReviewRes> reviews;

    public ServRes(ServEntity serv) {
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
                        .mapToInt(ServiceReview::getStart)
                        .sum()
                / reviewCount;
        this.bookingCount = serv.getBookingCount();
        this.thumbnailUrl = serv.getServiceImages()
                                    .stream()
                                    .filter(ServiceImg::getIsThumbnail)
                                    .map(ServiceImg::getImageUrl)
                                    .findFirst()
                                    .orElse(null);
        this.imgUrls = serv.getServiceImages().stream()
                                    .filter(servImg -> !servImg.getIsThumbnail())
                                    .map(servImg -> servImg.getImageUrl())
                                    .toList();
        this.reviews = serv.getServiceReviews().stream().map(servReview -> new ServReviewRes(servReview)).toList();
    }
}
