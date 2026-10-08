package com.navya.auth_service.config;

import com.navya.auth_service.model.User;
import com.navya.auth_service.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String defaultEmail = "admin@hospital.com";
        
        // Check if the user already exists so we don't duplicate it on restarts
        Optional<User> existingUser = userRepository.findByEmail(defaultEmail);
        
        if (existingUser.isEmpty()) {
            User adminUser = new User();
            adminUser.setEmail(defaultEmail);
            adminUser.setPassword(passwordEncoder.encode("admin123")); // securely hash the password
            adminUser.setRole("ADMIN");
            
            userRepository.save(adminUser);
            
            System.out.println("==================================================");
            System.out.println("Enterprise DB Init: Default Admin User Created!");
            System.out.println("Email: " + defaultEmail);
            System.out.println("Password: admin123");
            System.out.println("==================================================");
        }
    }
}
