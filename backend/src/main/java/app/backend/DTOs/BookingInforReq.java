package app.backend.DTOs;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Getter;


@Getter
public class BookingInforReq {
    private String fullName;
    private String phoneNumber;
    private List<Long> servIds;
    private LocalDateTime startTime;
}
