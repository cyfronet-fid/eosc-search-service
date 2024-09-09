"""Harvest language as arr[str] from 'languageMain'"""

from pandas import DataFrame


def harvest_language(df: DataFrame) -> list[list[str]]:
    """Create language column from Rodbuk's 'languageMain' nested field"""
    language_column = []
    for row in df["metadataBlocks"]:
        for field in row["citation"]["fields"]:
            raw_language_row = []
            if field["typeName"] == "languageMain":  # language property
                for val in field["value"]:
                    if val.get("language"):
                        raw_language_row.append(val["language"]["value"])
                language_column.append(list(set(raw_language_row)))
                break
        else:
            language_column.append([])

    return language_column
