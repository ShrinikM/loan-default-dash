package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "loan_applications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "loan_amnt")
    private BigDecimal loanAmnt;

    private String term;

    private String purpose;

    @Column(name = "annual_inc")
    private BigDecimal annualInc;

    @Column(name = "emp_length")
    private BigDecimal empLength;

    @Column(name = "home_ownership")
    private String homeOwnership;

    @Column(name = "verification_status")
    private String verificationStatus;

    @Column(name = "application_type")
    private String applicationType;

    @Column(name = "addr_state")
    private String addrState;

    private BigDecimal dti;

    @Column(name = "fico_range_low")
    private BigDecimal ficoRangeLow;

    @Column(name = "fico_range_high")
    private BigDecimal ficoRangeHigh;

    @Column(name = "unemployment_rate")
    private BigDecimal unemploymentRate;

    @Column(name = "delinq_rate")
    private BigDecimal delinqRate;

    @Column(name = "pd_score")
    private BigDecimal pdScore;

    @Column(name = "risk_tier")
    private String riskTier;

    private String decision;

    @Column(name = "fico_warning")
    private Boolean ficoWarning;

    @Column(name = "top_risk_factors", columnDefinition = "text[]")
    private String[] topRiskFactors;

    @Column(name = "imputed_fields", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String imputedFields;

    @Column(name = "ai_summary")
    private String aiSummary;

    @Column(name = "banker_notes")
    private String bankerNotes;

    @Column(name = "final_decision")
    private String finalDecision;
}

