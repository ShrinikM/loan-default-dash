"""Pydantic v2 models for loan application API."""

from typing import Literal

from pydantic import BaseModel, Field


class LoanApplication(BaseModel):
    """Input model for a loan application."""

    loan_amnt: float = Field(..., gt=0, description="Loan amount")
    term: Literal["36 months", "60 months"]
    purpose: str
    annual_inc: float = Field(..., gt=0, description="Annual income")
    emp_length: float = Field(..., ge=0, le=40, description="Employment length in years")
    home_ownership: Literal["RENT", "OWN", "MORTGAGE", "OTHER"]
    verification_status: Literal["Not Verified", "Source Verified", "Verified"]
    application_type: Literal["Individual", "Joint App"]
    addr_state: str = Field(..., min_length=2, max_length=2)
    dti: float = Field(..., ge=0, description="Debt-to-income ratio")
    fico_range_low: float = Field(..., ge=300, le=850)
    fico_range_high: float = Field(..., ge=300, le=850)


class PredictionResponse(BaseModel):
    """Output model for prediction response."""

    pd_score: float = Field(..., ge=0, le=1, description="Probability of default")
    risk_tier: str = Field(..., description="low / medium / high")
    decision: str = Field(..., description="approve / review / reject")
    fico_warning: bool = Field(..., description="True if fico_range_low < 660")
    top_risk_factors: list[str] = Field(..., description="Top 3 feature names driving risk")
    unemployment_rate: float
    delinq_rate: float
    imputed_fields: dict = Field(..., description="Bureau fields simulated from FICO")
