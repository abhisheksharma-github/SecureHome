package com.securehome.dto;
import lombok.*;
import java.time.OffsetDateTime;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AlarmPayload {
    private Long alarmId,userId; private String memberName,houseNumber,block,message,status; private Integer floor; private OffsetDateTime triggeredAt;
}
