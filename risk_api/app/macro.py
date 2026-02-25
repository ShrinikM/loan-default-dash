from functools import lru_cache
from pathlib import Path

import pandas as pd


def _get_project_root() -> Path:
    return Path(__file__).parent.parent


@lru_cache(maxsize=1)
def get_macro_values() -> dict:
    root = _get_project_root()

    # UNRATE.csv: observation_date, UNRATE
    unr_path = root / "data" / "UNRATE.csv"
    unrate_df = pd.read_csv(unr_path)
    unrate_df = unrate_df.dropna(subset=["UNRATE"])
    unrate_df = unrate_df.sort_values("observation_date")
    unemployment_rate = float(unrate_df["UNRATE"].iloc[-1])

    # DRCLACBS.csv: observation_date, DRCLACBS
    drcl_path = root / "data" / "DRCLACBS.csv"
    drcl_df = pd.read_csv(drcl_path)
    drcl_df = drcl_df.dropna(subset=["DRCLACBS"])
    drcl_df = drcl_df.sort_values("observation_date")
    delinq_rate = float(drcl_df["DRCLACBS"].iloc[-1])

    return {"unemployment_rate": unemployment_rate, "delinq_rate": delinq_rate}
