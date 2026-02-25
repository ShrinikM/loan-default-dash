package com.example.backend.service;

import com.example.backend.dto.LoanRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OllamaService {

    private final RestTemplate restTemplate;

    @Value("${ollama.base-url}")
    private String ollamaBaseUrl;

    public String generateSummary(LoanRequestDTO request, FastApiService.PredictionResult prediction) {
        try {
            BigDecimal pdScore = prediction.getPdScore() != null
                    ? prediction.getPdScore().multiply(BigDecimal.valueOf(100))
                    : BigDecimal.ZERO;

            List<String> topRiskFactorsList = prediction.getTopRiskFactors();
            String topRiskFactors = (topRiskFactorsList != null && !topRiskFactorsList.isEmpty())
                    ? String.join(", ", topRiskFactorsList)
                    : "None";

            String prompt = "You are a bank risk analyst. Summarize this loan application decision in 2-3 sentences \n" +
                    "for a banker. Be concise and professional.\n" +
                    "Applicant: annual income $" + request.getAnnualInc() + ", DTI " + request.getDti() + "%, requested $" +
                    request.getLoanAmnt() + " for " + request.getPurpose() + ".\n" +
                    "FICO score: " + request.getFicoRangeLow() + "-" + request.getFicoRangeHigh() + ".\n" +
                    "Model decision: " + prediction.getDecision() + " with " + pdScore + "% probability of default.\n" +
                    "Top risk factors: " + topRiskFactors + ".\n" +
                    "FICO warning: " + prediction.getFicoWarning() + ".";

            Map<String, Object> body = new HashMap<>();
            body.put("model", "llama3.2");
            body.put("prompt", prompt);
            body.put("stream", false);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(
                    ollamaBaseUrl + "/api/generate",
                    body,
                    Map.class
            );

            if (response != null && response.get("response") != null) {
                return String.valueOf(response.get("response"));
            }

            return "AI summary unavailable.";
        } catch (Exception ex) {
            return "AI summary unavailable.";
        }
    }
}

