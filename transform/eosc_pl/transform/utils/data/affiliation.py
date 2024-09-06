"""Harvest affiliation as arr[str] from 'contacts'"""

from pandas import DataFrame


def harvest_affiliation(df: DataFrame) -> list[list[int]]:
    """Create affiliation column from Rodbuk's 'contacts' nested field"""
    return [list({contact["affiliation"] for contact in contacts}) for contacts in df["contacts"]]
