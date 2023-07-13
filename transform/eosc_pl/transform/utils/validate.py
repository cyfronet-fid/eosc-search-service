from typing import Optional
from requests import Response

import pandas as pd


def validate_loaded_pd_df(response: Response, df: pd.DataFrame) -> Optional[AssertionError]:
    """Validate loaded pandas df"""
    try:
        # All data was returned
        assert len(df) == response.json()['data']['total_count'], "Not all resources were returned"
        # All resources are dataset type
        assert (df['type'] == 'dataset').all(), "Not all resources are dataset type"
    except AssertionError as e:
        return e
