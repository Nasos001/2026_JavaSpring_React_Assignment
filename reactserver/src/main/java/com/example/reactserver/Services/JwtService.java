package com.example.reactserver.Services;

// Imports 
// ===============================================================================================================================================
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

// Class
// ===============================================================================================================================================
@Service
public class JwtService {

    // Properties
    // ----------------------------------------------------------------------------------------------------------------
    private final Key SECRET_KEY;
    private final long EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000;

    // Constructor
    // ----------------------------------------------------------------------------------------------------------------
    public JwtService(@Value("${jwt.secret}") String secret) {
        // Convert base64 string to a Key
        this.SECRET_KEY = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // Generate Token
    // ----------------------------------------------------------------------------------------------------------------
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY)
                .compact();
    }

    // Validate Token
    // ----------------------------------------------------------------------------------------------------------------
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Get Email
    // ----------------------------------------------------------------------------------------------------------------
    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }
}