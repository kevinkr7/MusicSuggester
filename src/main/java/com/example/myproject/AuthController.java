package com.example.myproject;

import com.example.myproject.model.AppUser;
import com.example.myproject.repository.AppUserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AppUserRepository appUserRepository;

    public AuthController(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AppUser payload, HttpSession session) {
        if (payload.getUsername() == null || payload.getEmail() == null || payload.getPassword() == null
                || payload.getUsername().isBlank() || payload.getEmail().isBlank() || payload.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username, email and password are required."));
        }

        if (appUserRepository.existsByUsername(payload.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Username already exists."));
        }

        if (appUserRepository.existsByEmail(payload.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email already exists."));
        }

        AppUser newUser = new AppUser();
        newUser.setUsername(payload.getUsername().trim());
        newUser.setEmail(payload.getEmail().trim());
        newUser.setPassword(payload.getPassword());

        AppUser saved = appUserRepository.save(newUser);
        session.setAttribute("userId", saved.getId());
        session.setAttribute("username", saved.getUsername());

        return ResponseEntity.status(HttpStatus.CREATED).body(buildSessionResponse(saved.getUsername(), saved.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload, HttpSession session) {
        String identifier = payload.get("identifier");
        String password = payload.get("password");

        if (identifier == null || password == null || identifier.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username/email and password are required."));
        }

        Optional<AppUser> userOpt = appUserRepository.findByUsernameOrEmail(identifier.trim(), identifier.trim());
        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials."));
        }

        AppUser user = userOpt.get();
        session.setAttribute("userId", user.getId());
        session.setAttribute("username", user.getUsername());

        return ResponseEntity.ok(buildSessionResponse(user.getUsername(), user.getEmail()));
    }

    @GetMapping("/session")
    public ResponseEntity<?> session(HttpSession session) {
        Object userId = session.getAttribute("userId");
        Object username = session.getAttribute("username");

        if (userId == null || username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "No active session."));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", true);
        response.put("username", username);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logged out."));
    }

    private Map<String, Object> buildSessionResponse(String username, String email) {
        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", true);
        response.put("username", username);
        response.put("email", email);
        return response;
    }
}
