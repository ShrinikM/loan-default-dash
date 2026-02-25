package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LoanRequestDTO {

    @NotNull
    @Positive
    private BigDecimal loanAmnt;

    @NotBlank
    private String term;

    @NotBlank
    private String purpose;

    @NotNull
    @Positive
    private BigDecimal annualInc;

    @NotNull
    private BigDecimal empLength;

    @NotBlank
    private String homeOwnership;

    @NotBlank
    private String verificationStatus;

    @NotBlank
    private String applicationType;

    @NotBlank
    private String addrState;

    @NotNull
    private BigDecimal dti;

    @NotNull
    private BigDecimal ficoRangeLow;

    @NotNull
    private BigDecimal ficoRangeHigh;
}

