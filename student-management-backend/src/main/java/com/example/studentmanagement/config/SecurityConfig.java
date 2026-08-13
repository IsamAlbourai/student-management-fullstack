package com.example.studentmanagement.config;

import com.example.studentmanagement.security.JwtAuthenticationEntryPoint;
import com.example.studentmanagement.security.JwtAuthenticationFilter;
import jakarta.servlet.DispatcherType;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(
            PasswordEncoder passwordEncoder) {

        UserDetails user = User.builder()
                .username("student")
                .password(passwordEncoder.encode("student123"))
                .roles("USER")
                .build();

        UserDetails admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(
                user,
                admin
        );
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter,
            JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint)
            throws Exception {

        http
                .csrf(csrf ->
                        csrf.disable()
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(
                                jwtAuthenticationEntryPoint
                        )
                        .accessDeniedHandler(
                                (request, response, accessDeniedException) -> {
                                    response.setStatus(
                                            HttpServletResponse.SC_FORBIDDEN
                                    );
                                }
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        .dispatcherTypeMatchers(
                                DispatcherType.ERROR
                        )
                        .permitAll()

                        .requestMatchers("/api/auth/**")
                        .permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/students/**"
                        )
                        .hasAnyRole("USER", "ADMIN")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/students/**"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/students/**"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/students/**"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/departments/**"
                        )
                        .hasAnyRole("USER", "ADMIN")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/departments/**"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/departments/**"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/departments/**"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/profiles/**"
                        )
                        .hasAnyRole("USER", "ADMIN")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/profiles/**"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/profiles/**"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/profiles/**"
                        )
                        .hasRole("ADMIN")

                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}