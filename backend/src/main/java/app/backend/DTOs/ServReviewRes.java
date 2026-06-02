package app.backend.DTOs;

import app.backend.models.ServiceReview;
import lombok.Getter;


@Getter
public class ServReviewRes {
    private Long id;
    private String customerName;
    private Integer start;
    private String comment;

    public ServReviewRes(ServiceReview serviceReview){
        this.id = serviceReview.getId();
        this.customerName = serviceReview.getCustomer().getUsername();
        this.start = serviceReview.getStart();
        this.comment = serviceReview.getComment();
    }
}
