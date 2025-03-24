package com.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.model.UserInfo;
import com.app.service.UserService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/user")

@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")

public class UserController {
	@Autowired
    private UserService userService;
	@GetMapping
    public List<UserInfo> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserInfo> getUserById(@PathVariable("id") String id) {
        UserInfo user = userService.getUserById(id);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<UserInfo> createUser(@RequestBody UserInfo userInfo) {
        try {
            UserInfo createdUser = userService.createUser(userInfo);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserInfo userInfo) {
        UserInfo user = userService.findByUsername(userInfo.getUsername());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        if (!user.getPassword().equals(userInfo.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        return ResponseEntity.ok("Authentication successful");
    }
    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {

       session.invalidate();
        return ResponseEntity.ok("Logged out successfully!");
    }
}   