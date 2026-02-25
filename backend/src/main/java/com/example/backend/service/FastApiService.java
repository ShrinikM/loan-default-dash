package com.example.backend.service;

import com.example.backend.dto.LoanRequestDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FastApiService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${fastapi.base-url}")
    private String fastapiBaseUrl;

    @Data
    public static class PredictionResult {

        @JsonProperty("pd_score")
        private BigDecimal pdScore;

        @JsonProperty("risk_tier")
        private String riskTier;

        private String decision;

        @JsonProperty("fico_warning")
        private Boolean ficoWarning;

        @JsonProperty("top_risk_factors")
        private List<String> topRiskFactors;

        @JsonProperty("unemployment_rate")
        private BigDecimal unemploymentRate;

        @JsonProperty("delinq_rate")
        private BigDecimal delinqRate;

        @JsonProperty("imputed_fields")
        private Map<String, Object> imputedFields;
    }

    public PredictionResult callPredict(LoanRequestDTO request) {
        try {
            String url = fastapiBaseUrl + "/predict";

            ObjectMapper snakeCaseMapper = objectMapper.copy();
            snakeCaseMapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
            Map<String, Object> payload = snakeCaseMapper.convertValue(request, Map.class);

            return restTemplate.postForObject(url, payload, PredictionResult.class);
        } catch (RestClientException ex) {
            throw new RuntimeException("Failed to call FastAPI predict endpoint", ex);
        }
    }
}

