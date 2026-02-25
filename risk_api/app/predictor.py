from functools import lru_cache
from pathlib import Path

import joblib
import numpy as np
import pandas as pd


def _get_project_root() -> Path:
    return Path(__file__).parent.parent


@lru_cache(maxsize=1)
def _load_model():
    root = _get_project_root()
    return joblib.load(root / "models" / "model.pkl")


@lru_cache(maxsize=1)
def _load_scaler():
    root = _get_project_root()
    return joblib.load(root / "models" / "scaler.pkl")


@lru_cache(maxsize=1)
def _load_model_columns() -> list:
    root = _get_project_root()
    return joblib.load(root / "models" / "model_columns.pkl")


def get_decision(pd_score: float) -> str:
    if pd_score < 0.40:
        return "approve"
    if pd_score <= 0.65:
        return "review"
    return "reject"


def get_risk_tier(pd_score: float) -> str:
    if pd_score < 0.40:
        return "low"
    if pd_score <= 0.65:
        return "medium"
    return "high"


def get_top_risk_factors(model, feature_names, top_n=3):
    coeffs = model.coef_[0]
    feature_names = list(feature_names)
    
    # Get indices of top positive coefficients (structural risk drivers)
    positive_mask = coeffs > 0
    positive_indices = np.where(positive_mask)[0]
    
    # Sort by coefficient value descending
    sorted_positive = positive_indices[
        np.argsort(coeffs[positive_indices])[::-1]
    ]
    top_indices = sorted_positive[:top_n]
    
    # Clean feature names
    raw_names = [feature_names[i] for i in top_indices]
    clean_names = []
    for name in raw_names:
        clean = name.replace('_', ' ').title()
        clean = ' '.join(clean.split())
        clean_names.append(clean)
    
    return clean_names


def predict(input_dict: dict) -> dict:

    model = _load_model()
    scaler = _load_scaler()
    model_columns = _load_model_columns()

    df = pd.DataFrame([input_dict])

    df_dummies = pd.get_dummies(df, drop_first=True)
    df_aligned = df_dummies.reindex(columns=model_columns, fill_value=0)
    df_aligned = df_aligned[model_columns]
    input_scaled = scaler.transform(df_aligned)
    proba = model.predict_proba(input_scaled)[0]
    pd_score = float(proba[1])

    return {
        "pd_score": pd_score,
        "decision": get_decision(pd_score),
        "risk_tier": get_risk_tier(pd_score),
        "top_risk_factors": get_top_risk_factors(model, model_columns, top_n=3),
    }
