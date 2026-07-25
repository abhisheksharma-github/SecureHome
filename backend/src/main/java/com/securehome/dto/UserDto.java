package com.securehome.dto;
import lombok.*;
import java.time.OffsetDateTime;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserDto {
    private Long id; private String fullName,email,phone,role,houseNumber; private Boolean isActive; private Long houseId; private OffsetDateTime createdAt;
}
