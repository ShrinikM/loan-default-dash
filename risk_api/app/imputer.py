"""Load FICO imputation table and impute bureau fields from FICO range."""

import json
from functools import lru_cache
from pathlib import Path


def _get_project_root() -> Path:
    """Return project root (where uvicorn is run from)."""
    return Path(__file__).parent.parent


@lru_cache(maxsize=1)
def _load_fico_imputation_table() -> dict:
    """Load fico_imputation_table.json and cache result."""
    root = _get_project_root()
    path = root / "data" / "fico_imputation_table.json"
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def _get_fico_tier(fico_range_low: float, fico_range_high: float) -> str:
    """
    Tier assignment based on fico_mid = (fico_range_low + fico_range_high) / 2:
    - fico_mid < 700 → "standard"
    - 700 <= fico_mid < 725 → "good"
    - 725 <= fico_mid < 750 → "very_good"
    - fico_mid >= 750 → "exceptional"
    """
    fico_mid = (fico_range_low + fico_range_high) / 2
    if fico_mid < 700:
        return "standard"
    if fico_mid < 725:
        return "good"
    if fico_mid < 750:
        return "very_good"
    return "exceptional"


def impute_bureau_fields(fico_range_low: float, fico_range_high: float) -> tuple[dict, str, bool]:
    """
    Impute bureau fields from FICO range using imputation table.
    Returns tuple of (imputed_dict, fico_tier_string, fico_warning_bool).
    fico_warning is True if fico_range_low < 660.
    """
    table = _load_fico_imputation_table()
    tier = _get_fico_tier(fico_range_low, fico_range_high)
    imputed = dict(table[tier])
    fico_warning = fico_range_low < 660
    return imputed, tier, fico_warning
