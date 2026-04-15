package com.example.reactserver.Infrastructure;

// Imports
// ===============================================================================================================================================
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.reactserver.Services.JwtService;

import java.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import jakarta.servlet.http.Cookie;

// Class
// ===============================================================================================================================================
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // Properties
    // --------------------------------------------------------------------------------------------
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    // Constructor
    // --------------------------------------------------------------------------------------------
    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    // Token Extraction
    // --------------------------------------------------------------------------------------------
    private String extractTokenFromCookie(HttpServletRequest request) {

        // If no cookies, return null
        if (request.getCookies() == null)
            return null;

        // Find the authToken Cookie
        for (Cookie cookie : request.getCookies()) {
            if ("authToken".equals(cookie.getName())) {

                // Get its value
                return cookie.getValue();
            }
        }

        // Otherwise return null
        return null;
    }

    // Define Filter
    // --------------------------------------------------------------------------------------------
    @Override
    protected void doFilterInternal(@NonNull  HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        String token = extractTokenFromCookie(request);

        if (token != null &&
                jwtService.validateToken(token) &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            // Get email from token
            String email = jwtService.getEmailFromToken(token);

            // Get User details
            UserDetails user = userDetailsService.loadUserByUsername(email);

            // Define Authenticated User
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, null,
                    user.getAuthorities());

            // Set Authenticated User
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        // Continue the request
        filterChain.doFilter(request, response);
    }
}
