package app.backend.DTOs;

import app.backend.models.ServiceReview;
import lombok.Getter;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;


@Getter
public class ServReviewRes {
    private String customerName;
    private Integer star;
    private String comment;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate createDate;

    public ServReviewRes(ServiceReview serviceReview){
        this.customerName = serviceReview.getCustomer().getUsername();
        this.star = serviceReview.getStars();
        this.comment = serviceReview.getComment();
        this.createDate = serviceReview.getCreatedAt() != null ? serviceReview.getCreatedAt().toLocalDate() : null;
    }
}
