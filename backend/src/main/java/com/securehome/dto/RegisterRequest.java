package com.securehome.dto;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data public class RegisterRequest {
    @NotBlank @Size(min=2,max=100) private String fullName;
    @NotBlank @Email private String email;
    @NotBlank @Size(min=8) private String password;
    private String phone;
    private String houseNumber;
}
