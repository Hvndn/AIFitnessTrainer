package com.example.demo.controller;

import com.example.demo.model.TestUser;
import com.example.demo.repository.TestUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-users")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TestUserController {

    @Autowired
    private TestUserRepository testUserRepository;

    // GET /api/test-users
    @GetMapping
    public List<TestUser> getAllUsers() {
        return testUserRepository.findAll();
    }

    // POST /api/test-users
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody TestUser user) {
        try {
            TestUser savedUser = testUserRepository.save(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
