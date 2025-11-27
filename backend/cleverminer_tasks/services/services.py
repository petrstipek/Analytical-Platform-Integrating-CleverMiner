import pandas as pd
from cleverminer import cleverminer, clm_vars, clm_lcut
from sklearn.impute import SimpleImputer


def run_demo_analysis():
    df = pd.read_csv(
        "https://www.cleverminer.org/data/accidents.zip",
        encoding="cp1250",
        sep="\t",
    )
    df = df[["Driver_Age_Band", "Sex", "Speed_limit", "Severity"]]

    imputer = SimpleImputer(strategy="most_frequent")
    df = pd.DataFrame(imputer.fit_transform(df), columns=df.columns)

    clm = cleverminer(
        df=df,
        proc="fourftMiner",
        quantifiers={"Base": 2000, "aad": 0.5},
        ante=clm_vars(["Driver_Age_Band", "Sex", "Speed_limit"]),
        succ={
            "attributes": [clm_lcut("Severity")],
            "minlen": 1,
            "maxlen": 1,
            "type": "con",
        },
    )
    return clm
