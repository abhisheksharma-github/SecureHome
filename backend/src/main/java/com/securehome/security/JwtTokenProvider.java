package com.securehome.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

    private final SecretKey secretKey;
    private final long expirationMs;

    public JwtTokenProvider(@Value("${securehome.jwt.secret}") String secret,
            @Value("${securehome.jwt.expiration-ms}") long expirationMs) {
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(secret);
        } catch (IllegalArgumentException ex) {
            keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        }
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    public String generateToken(Authentication auth) {
        return buildToken((CustomUserDetails) auth.getPrincipal());
    }

    public String generateToken(CustomUserDetails d) {
        return buildToken(d);
    }

    private String buildToken(CustomUserDetails d) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);
        return Jwts.builder().subject(d.getUsername())
                .claim("userId", d.getId()).claim("fullName", d.getFullName())
                .claim("role", d.getRole().name()).claim("houseId", d.getHouseId())
                .issuedAt(now).expiration(exp).signWith(secretKey).compact();
    }

    public String getEmailFromToken(String t) {
        return parseClaims(t).getSubject();
    }

    public Long getUserIdFromToken(String t) {
        return ((Number) parseClaims(t).get("userId")).longValue();
    }

    private Claims parseClaims(String t) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(t).getPayload();
    }

    public boolean validateToken(String t) {
        try {
            Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(t);
            return true;
        } catch (Exception e) {
            log.warn("JWT invalid: {}", e.getMessage());
            return false;
        }
    }
}
