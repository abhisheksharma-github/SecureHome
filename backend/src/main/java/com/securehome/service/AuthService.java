package com.securehome.service;

import com.securehome.dto.*;
import com.securehome.entity.*;
import com.securehome.repository.*;
import com.securehome.security.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final HouseRepository houseRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public LoginResponse register(RegisterRequest req) {
        String email = normalizeEmail(req.getEmail());
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered: " + req.getEmail());
        }
        House house = null;
        if (req.getHouseNumber() != null && !req.getHouseNumber().isBlank()) {
            house = houseRepository.findByHouseNumber(req.getHouseNumber().toUpperCase())
                    .orElseThrow(() -> new IllegalArgumentException("House not found: " + req.getHouseNumber()));
        }
        User user = User.builder().fullName(req.getFullName())
                .email(email)
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone()).role(User.Role.MEMBER).isActive(true).house(house).build();
        userRepository.save(user);
        log.info("Registered MEMBER: {}", user.getEmail());
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, req.getPassword()));
        return build(jwtTokenProvider.generateToken(auth), (CustomUserDetails) auth.getPrincipal(), house);
    }

    public LoginResponse login(LoginRequest req) {
        String email = normalizeEmail(req.getEmail());
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, req.getPassword()));
        CustomUserDetails d = (CustomUserDetails) auth.getPrincipal();
        House house = d.getHouseId() != null ? houseRepository.findById(d.getHouseId()).orElse(null) : null;
        log.info("Login: {} ({})", d.getUsername(), d.getRole());
        return build(jwtTokenProvider.generateToken(auth), d, house);
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            throw new IllegalArgumentException("Email is required");
        }
        return email.toLowerCase().trim();
    }

    private LoginResponse build(String token, CustomUserDetails d, House house) {
        return LoginResponse.builder().token(token).tokenType("Bearer")
                .userId(d.getId()).email(d.getUsername()).fullName(d.getFullName()).role(d.getRole().name())
                .houseId(house != null ? house.getId() : null).houseNumber(house != null ? house.getHouseNumber() : null).build();
    }
}
