"""Load data"""
import requests
import logging
import pandas as pd
from eosc_pl.transform.utils.validate import validate_loaded_pd_df

logger = logging.getLogger(__name__)


def pd_load_datasets(url: str) -> pd.DataFrame:
    """Load datasets from url as pandas df"""
    try:
        response = requests.get(url, timeout=20)
        response.raise_for_status()  # Raise an exception for any unsuccessful response
        data = response.json()['data']['items']
        data = pd.DataFrame(data)
        validate_loaded_pd_df(response, data)
        return data
    except requests.exceptions.RequestException as e:
        logger.error("Error during the request:", e)
    except (KeyError, ValueError) as e:
        logger.error("Error while parsing the response:", e)
    except Exception as e:
        logger.error("An unexpected error occurred:", e)
