package com.dhanesh.restaurant.controller;

import com.dhanesh.restaurant.dto.AuthResponse;
import com.dhanesh.restaurant.dto.LoginRequest;
import com.dhanesh.restaurant.dto.RegisterRequest;
import com.dhanesh.restaurant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public AuthResponse register(
            @RequestBody RegisterRequest request) {

        String message = userService.register(request);

        return new AuthResponse(message);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request) {

        return userService.login(
                request.getEmail(),
                request.getPassword());
    }
}