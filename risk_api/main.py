from fastapi import FastAPI

from app.macro import get_macro_values
from app.imputer import impute_bureau_fields
from app.predictor import predict
from app.schema import LoanApplication, PredictionResponse

app = FastAPI(title="Loan Default Risk Scoring API")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictionResponse)
def predict_endpoint(application: LoanApplication):
    """
    Predict loan default risk from application data.
    1. Get macro values (unemployment_rate, delinq_rate)
    2. Impute bureau fields from FICO
    3. Build input_dict
    4. Run prediction
    5. Return full PredictionResponse
    """
    # 1. Macro values
    macro = get_macro_values()
    unemployment_rate = macro["unemployment_rate"]
    delinq_rate = macro["delinq_rate"]

    # 2. Impute bureau fields
    imputed, fico_tier, fico_warning = impute_bureau_fields(
        application.fico_range_low, application.fico_range_high
    )
    imputed_fields = {k: v for k, v in imputed.items()}

    # 3. Build input_dict: application + macro + imputed
    # Note: fico_range_low/high excluded - model uses imputed bureau fields instead
    input_dict = {
        "loan_amnt": application.loan_amnt,
        "term": application.term,
        "purpose": application.purpose,
        "annual_inc": application.annual_inc,
        "emp_length": application.emp_length,
        "home_ownership": application.home_ownership,
        "verification_status": application.verification_status,
        "application_type": application.application_type,
        "addr_state": application.addr_state,
        "dti": application.dti,
        "unemployment_rate": unemployment_rate,
        "delinq_rate": delinq_rate,
        **imputed_fields,
    }

    result = predict(input_dict)

    
    return PredictionResponse(
        pd_score=result["pd_score"],
        risk_tier=result["risk_tier"],
        decision=result["decision"],
        fico_warning=fico_warning,
        top_risk_factors=result["top_risk_factors"],
        unemployment_rate=unemployment_rate,
        delinq_rate=delinq_rate,
        imputed_fields=imputed_fields,
    )
