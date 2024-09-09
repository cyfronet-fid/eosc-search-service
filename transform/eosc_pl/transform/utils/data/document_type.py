"""Harvest document_type as arr[str] from 'kindOfDataMain'"""

from pandas import DataFrame

from eosc_pl.mappings.document_type import document_type_mapping


def map_document_type(document_type: str) -> str:
    """Map document_type if necessary"""
    if document_type.lower() in document_type_mapping.keys():
        return document_type_mapping[document_type.lower()]
    return document_type


def harvest_document_type(df: DataFrame) -> list[list[str]]:
    """Create document_type column from Rodbuk's 'kindOfDataMain' nested field"""
    document_type_column = []
    for row in df["metadataBlocks"]:
        for field in row["citation"]["fields"]:
            raw_document_type_row = []
            if field["typeName"] == "kindOfDataMain":  # document_type property
                for val in field["value"]:
                    if val.get("kindOfData"):
                        raw_document_type_row.append(
                            map_document_type(val["kindOfData"]["value"])
                        )
                document_type_column.append(list(set(raw_document_type_row)))
                break
        else:
            document_type_column.append([])

    return document_type_column
