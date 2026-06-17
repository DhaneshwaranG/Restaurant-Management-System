package com.dhanesh.restaurant.service;

import com.dhanesh.restaurant.config.JwtUtil;
import com.dhanesh.restaurant.dto.AuthResponse;
import com.dhanesh.restaurant.dto.RegisterRequest;
import com.dhanesh.restaurant.entity.User;
import com.dhanesh.restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    public String register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already exists";
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // plain password for now
        user.setPassword(
                passwordEncoder.encode(request.getPassword()));

        user.setRole("CUSTOMER");

        userRepository.save(user);

        return "Registration Successful";
    }

    public AuthResponse login(
        String email,
        String password) {

    User user = userRepository
            .findByEmail(email)
            .orElse(null);

    if (user == null) {
        return new AuthResponse("Invalid Email");
    }

    if (!passwordEncoder.matches(
            password,
            user.getPassword()
    )) {
        return new AuthResponse("Invalid Password");
    }

    String token =
            jwtUtil.generateToken(user.getEmail());

    return new AuthResponse(
            "Login Successful",
            token
    );
}
}