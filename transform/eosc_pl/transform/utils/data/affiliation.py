"""Harvest affiliation as arr[str] from 'contacts'"""

from pandas import DataFrame


def harvest_affiliation(df: DataFrame) -> list[list[str]]:
    """Create affiliation column from Rodbuk's 'contacts' nested field"""
    # there is some random nan of type float in the data
    return [
        (
            list({contact["affiliation"] for contact in contacts})
            if isinstance(contacts, list)
            else []
        )
        for contacts in df["contacts"]
    ]
