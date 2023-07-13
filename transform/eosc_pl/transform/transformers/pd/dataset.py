"""Dataset transformer"""
from logging import getLogger
from pandas import DataFrame
from eosc_pl.transform.transformers.pd.base.base import BaseTransformer

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

        super().__init__(
            self.type, self.cols_to_drop, self.cols_to_rename
        )

    def transform(self, df: DataFrame) -> DataFrame:
        """Apply df transformations"""
        self.add_tg_fields(df)
        self.check_subjects_empty(df)
        self.serialize(df, ["contacts", "publications"])

        return df.reindex(sorted(df.columns), axis=1)

    def cast_columns(self, df: DataFrame) -> DataFrame:
        """Cast columns"""
        # String -> array
        self.map_str_to_arr(df, ["title", "url", "description"])

        return df

    @property
    def cols_to_drop(self) -> tuple | None:
        """Drop those columns from the dataframe"""
        return None

    @property
    def cols_to_rename(self) -> dict[str, str] | None:
        """Columns to rename. Keys are mapped to the values"""
        return {
            "name": "title",
            "global_id": "id",
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
            logger.warning("'subjects' column contains non-empty arrays in some records - or they are not an array.")