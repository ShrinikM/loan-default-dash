package com.example.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
public class LoanResponseDTO {

    private UUID id;

    private LocalDateTime createdAt;

    private BigDecimal loanAmnt;

    private String term;

    private String purpose;

    private BigDecimal annualInc;

    private BigDecimal empLength;

    private String homeOwnership;

    private String verificationStatus;

    private String applicationType;

    private String addrState;

    private BigDecimal dti;

    private BigDecimal ficoRangeLow;

    private BigDecimal ficoRangeHigh;

    private BigDecimal pdScore;

    private String riskTier;

    private String decision;

    private Boolean ficoWarning;

    private List<String> topRiskFactors;

    private Map<String, Object> imputedFields;

    private String aiSummary;

    private BigDecimal unemploymentRate;

    private BigDecimal delinqRate;
}

