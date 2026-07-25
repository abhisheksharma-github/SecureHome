package com.securehome.dto;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class LoginResponse {
    private String token,tokenType,email,fullName,role,houseNumber;
    private Long userId,houseId;
}
