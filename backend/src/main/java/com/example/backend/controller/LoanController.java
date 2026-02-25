package com.example.backend.controller;

import com.example.backend.dto.LoanRequestDTO;
import com.example.backend.dto.LoanResponseDTO;
import com.example.backend.service.LoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class LoanController {

    private final LoanService loanService;

    @PostMapping("/apply")
    public LoanResponseDTO apply(@Valid @RequestBody LoanRequestDTO request) {
        return loanService.processApplication(request);
    }

    @GetMapping
    public List<LoanResponseDTO> getAll() {
        return loanService.getAllApplications();
    }

    @GetMapping("/{id}")
    public LoanResponseDTO getById(@PathVariable UUID id) {
        return loanService.getApplicationById(id);
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return loanService.getDashboardStats();
    }
}

