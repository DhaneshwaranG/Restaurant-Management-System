package com.dhanesh.restaurant.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

        @Autowired
        private JwtFilter jwtFilter;

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration configuration = new CorsConfiguration();

                configuration.addAllowedOrigin("http://localhost:5173");
                configuration.addAllowedHeader("*");
                configuration.addAllowedMethod("*");
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration("/**", configuration);

                return source;
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http) throws Exception {

                http
                                .csrf(csrf -> csrf.disable())

                                .cors(cors -> {
                                })

                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))

                                .authorizeHttpRequests(auth -> auth

                                                // Public
                                                .requestMatchers("/api/auth/**").permitAll()

                                                // JWT Protected
                                                .requestMatchers("/api/categories/**").authenticated()
                                                .requestMatchers("/api/menu-items/**").authenticated()
                                                .requestMatchers("/api/orders/**").authenticated()

                                                .anyRequest().authenticated())

                                .formLogin(form -> form.disable());

                http.addFilterBefore(
                                jwtFilter,
                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}