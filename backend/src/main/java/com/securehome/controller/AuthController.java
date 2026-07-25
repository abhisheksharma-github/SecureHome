package com.securehome.controller;
import com.securehome.dto.*;
import com.securehome.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@Slf4j @RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req){
        try{ return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(req)); }
        catch(IllegalArgumentException e){ return ResponseEntity.badRequest().body(Map.of("error",e.getMessage())); }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req){
        try{ return ResponseEntity.ok(authService.login(req)); }
        catch(Exception e){ log.warn("Login fail: {}",req.getEmail()); return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","Invalid email or password.")); }
    }
    @GetMapping("/verify")
    public ResponseEntity<Map<String,String>> verify(){ return ResponseEntity.ok(Map.of("status","Token is valid")); }
}
