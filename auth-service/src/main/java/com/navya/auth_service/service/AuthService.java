package com.navya.auth_service.service;

import com.navya.auth_service.dto.LoginRequestDTO;
import com.navya.auth_service.util.JwtUtil;

import io.jsonwebtoken.JwtException;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
            UserService userService,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {

        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public Optional<String> authenticate(LoginRequestDTO loginRequestDTO) {

        Optional<String> token = userService
                .findByEmail(loginRequestDTO.getEmail())
                .filter(user ->
                        passwordEncoder.matches(
                                loginRequestDTO.getPassword(),
                                user.getPassword()
                        )
                )
                .map(user ->
                        jwtUtil.generateToken(
                                user.getEmail(),
                                user.getRole()
                        )
                );

        return token;
    }

    public boolean validateToken(String token) {

        try {
            jwtUtil.validateToken(token);
            return true;

        } catch (JwtException e) {
            return false;
        }
    }
}