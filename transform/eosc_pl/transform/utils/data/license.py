"""Harvest license as str from 'license' - separate calls"""

from pandas import DataFrame

from eosc_pl.transform.utils.config import LICENSE_ADDRESS, get_config
from eosc_pl.transform.utils.loader import call_for_license


def get_license(response: dict) -> str:
    """Return license from a response"""
    return response.get("datasetVersion", {}).get("license", {}).get("name")


def harvest_license(df: DataFrame) -> list[str]:
    """Create license column from Rodbuk's 'license' nested field"""
    conf = get_config()
    license_column = []

    for doi in df["global_id"]:
        license_res = call_for_license(doi, conf[LICENSE_ADDRESS])
        license_column.append(get_license(license_res))

    return license_column
