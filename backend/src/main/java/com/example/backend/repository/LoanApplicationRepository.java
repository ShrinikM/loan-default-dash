package com.example.backend.repository;

import com.example.backend.entity.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, UUID> {

    List<LoanApplication> findAllByOrderByCreatedAtDesc();

    List<LoanApplication> findByDecision(String decision);

    long countByDecision(String decision);

    List<LoanApplication> findTop10ByOrderByCreatedAtDesc();
}

