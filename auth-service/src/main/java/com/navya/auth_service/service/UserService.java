package com.navya.auth_service.service;

import com.navya.auth_service.model.User;
import com.navya.auth_service.repository.UserRepository;

import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}