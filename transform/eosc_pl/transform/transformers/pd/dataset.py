# pylint: disable=invalid-name, line-too-long
"""Dataset transformer"""
from logging import getLogger

from pandas import DataFrame, to_datetime

from eosc_pl.transform.transformers.pd.base.base import BaseTransformer
from eosc_pl.transform.utils.data.affiliation import harvest_affiliation
from eosc_pl.transform.utils.data.document_type import harvest_document_type
from eosc_pl.transform.utils.data.funder import harvest_funder
from eosc_pl.transform.utils.data.language import harvest_language
from eosc_pl.transform.utils.data.license import harvest_license
from eosc_pl.transform.utils.data.scientific_domains import harvest_scientific_domains

logger = getLogger(__name__)

DATASET = "DATASET"

AUTHOR_NAMES = "author_names"
KEYWORDS = "keywords"
AUTHOR_NAMES_TG = "author_names_tg"
KEYWORDS_TG = "keywords_tg"
SUBJECTS = "subjects"


class DatasetTransformer(BaseTransformer):
    """Transformer used to transform training resources"""

    def __init__(self):
        self.type = DATASET.lower()

        super().__init__(self.type, self.cols_to_drop, self.cols_to_rename)

    def transform(self, df: DataFrame) -> DataFrame:
        """Apply df transformations"""
        self.add_tg_fields(df)
        df["datasource_pids"] = [["eosc.cyfronet.rodbuk"]] * len(df)
        df["country"] = [["PL"]] * len(df)
        df["publication_year"] = to_datetime(df["published_at"]).dt.year
        df["scientific_domains"] = harvest_scientific_domains(df)
        df["funder"] = harvest_funder(df)
        df["document_type"] = harvest_document_type(df)
        df["language"] = harvest_language(df)
        df["affiliation"] = harvest_affiliation(df)
        df["license"] = harvest_license(df)
        self.transform_global_id(df)
        self.check_subjects_empty(df)
        self.serialize(df, ["contacts", "publications"])

        return df.reindex(sorted(df.columns), axis=1)

    def cast_columns(self, df: DataFrame) -> DataFrame:
        """Cast columns"""
        # String -> array
        self.map_str_to_arr(df, ["title", "url", "description", "doi"])

        return df

    @property
    def cols_to_drop(self) -> str | None:
        """Drop those columns from the dataframe"""
        return "metadataBlocks"

    @property
    def cols_to_rename(self) -> dict[str, str] | None:
        """Columns to rename. Keys are mapped to the values"""
        return {
            "name": "title",
            "global_id": "doi",
            "published_at": "publication_date",
            "citationHtml": "citation_html",
            "identifier_of_dataverse": "dataverse_id",
            "name_of_dataverse": "dataverse_name",
            "storageIdentifier": "storage_id",
            "fileCount": "file_count",
            "versionId": "version_id",
            "versionState": "version_state",
            "majorVersion": "major_version",
            "createdAt": "created_at",
            "updatedAt": "updated_at",
            "authors": AUTHOR_NAMES,
        }

    @staticmethod
    def transform_global_id(df: DataFrame) -> None:
        """Transform global_id (doi) to format used in our application.
        Simply remove 'doi:' form the beginning."""
        df["global_id"] = df["global_id"].str.replace("^doi:", "", regex=True)
        df["id"] = df["global_id"]  # We still need unique identifier
        # TODO ID shouldn't be taken from DOIs

    @staticmethod
    def add_tg_fields(df: DataFrame) -> None:
        """Add text_general fields"""
        df[AUTHOR_NAMES_TG] = df["authors"]
        df[KEYWORDS_TG] = df[KEYWORDS]

    @staticmethod
    def check_subjects_empty(df: DataFrame) -> None:
        """Check if the "subjects" column is an empty array for all records"""

        def print_warning(df: DataFrame):
            """Print warning if subjects are not empty"""
            if not isinstance(df[SUBJECTS], list) or len(df[SUBJECTS]) != 0:
                return True
            return False

        if df.apply(print_warning, axis=1).all():
            logger.warning(
                "'subjects' column contains non-empty arrays in some records - or they are not an array."
            )
