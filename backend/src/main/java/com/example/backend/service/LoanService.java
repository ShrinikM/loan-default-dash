package com.example.backend.service;

import com.example.backend.dto.LoanRequestDTO;
import com.example.backend.dto.LoanResponseDTO;
import com.example.backend.entity.LoanApplication;
import com.example.backend.repository.LoanApplicationRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final FastApiService fastApiService;
    private final OllamaService ollamaService;
    private final LoanApplicationRepository loanApplicationRepository;
    private final ObjectMapper objectMapper;

    public LoanResponseDTO processApplication(LoanRequestDTO request) {
        FastApiService.PredictionResult prediction = fastApiService.callPredict(request);
        String aiSummary = ollamaService.generateSummary(request, prediction);

        String imputedFieldsJson;
        try {
            imputedFieldsJson = objectMapper.writeValueAsString(prediction.getImputedFields());
        } catch (Exception e) {
            imputedFieldsJson = "{}";
        }

        LoanApplication application = LoanApplication.builder()
                .loanAmnt(request.getLoanAmnt())
                .term(request.getTerm())
                .purpose(request.getPurpose())
                .annualInc(request.getAnnualInc())
                .empLength(request.getEmpLength())
                .homeOwnership(request.getHomeOwnership())
                .verificationStatus(request.getVerificationStatus())
                .applicationType(request.getApplicationType())
                .addrState(request.getAddrState())
                .dti(request.getDti())
                .ficoRangeLow(request.getFicoRangeLow())
                .ficoRangeHigh(request.getFicoRangeHigh())
                .unemploymentRate(prediction.getUnemploymentRate())
                .delinqRate(prediction.getDelinqRate())
                .pdScore(prediction.getPdScore())
                .riskTier(prediction.getRiskTier())
                .decision(prediction.getDecision())
                .ficoWarning(prediction.getFicoWarning())
                .topRiskFactors(prediction.getTopRiskFactors() != null
                        ? prediction.getTopRiskFactors().toArray(new String[0])
                        : null)
                .imputedFields(imputedFieldsJson)
                .aiSummary(aiSummary)
                .build();

        LoanApplication saved = loanApplicationRepository.save(application);

        return toDto(saved);
    }

    public List<LoanResponseDTO> getAllApplications() {
        List<LoanApplication> applications = loanApplicationRepository.findAllByOrderByCreatedAtDesc();
        List<LoanResponseDTO> result = new ArrayList<>();
        for (LoanApplication application : applications) {
            result.add(toDto(application));
        }
        return result;
    }

    public LoanResponseDTO getApplicationById(UUID id) {
        LoanApplication application = loanApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        return toDto(application);
    }

    public Map<String, Object> getDashboardStats() {
        long totalApplications = loanApplicationRepository.count();
        long approvedCount = loanApplicationRepository.countByDecision("approve");
        long reviewCount = loanApplicationRepository.countByDecision("review");
        long rejectedCount = loanApplicationRepository.countByDecision("reject");

        BigDecimal approvalRate = BigDecimal.ZERO;
        if (totalApplications > 0) {
            approvalRate = BigDecimal.valueOf(approvedCount)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(totalApplications), 2, RoundingMode.HALF_UP);
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalApplications", totalApplications);
        stats.put("approvedCount", approvedCount);
        stats.put("reviewCount", reviewCount);
        stats.put("rejectedCount", rejectedCount);
        stats.put("approvalRate", approvalRate);

        return stats;
    }

    private LoanResponseDTO toDto(LoanApplication application) {
        LoanResponseDTO dto = new LoanResponseDTO();
        dto.setId(application.getId());
        dto.setCreatedAt(application.getCreatedAt());
        dto.setLoanAmnt(application.getLoanAmnt());
        dto.setTerm(application.getTerm());
        dto.setPurpose(application.getPurpose());
        dto.setAnnualInc(application.getAnnualInc());
        dto.setEmpLength(application.getEmpLength());
        dto.setHomeOwnership(application.getHomeOwnership());
        dto.setVerificationStatus(application.getVerificationStatus());
        dto.setApplicationType(application.getApplicationType());
        dto.setAddrState(application.getAddrState());
        dto.setDti(application.getDti());
        dto.setFicoRangeLow(application.getFicoRangeLow());
        dto.setFicoRangeHigh(application.getFicoRangeHigh());
        dto.setPdScore(application.getPdScore());
        dto.setRiskTier(application.getRiskTier());
        dto.setDecision(application.getDecision());
        dto.setFicoWarning(application.getFicoWarning());
        dto.setAiSummary(application.getAiSummary());
        dto.setUnemploymentRate(application.getUnemploymentRate());
        dto.setDelinqRate(application.getDelinqRate());

        if (application.getTopRiskFactors() != null) {
            dto.setTopRiskFactors(Arrays.asList(application.getTopRiskFactors()));
        }

        if (application.getImputedFields() != null) {
            try {
                Map<String, Object> imputed = objectMapper.readValue(
                        application.getImputedFields(),
                        new TypeReference<Map<String, Object>>() {
                        }
                );
                dto.setImputedFields(imputed);
            } catch (Exception e) {
                dto.setImputedFields(Collections.emptyMap());
            }
        }

        return dto;
    }
}

