"""Common routes constants"""
from enum import Enum
from typing import Literal, TypeAlias


class Collection(str, Enum):
    """Collection names in Solr"""

    ALL_COLLECTION = "all_collection"
    BUNDLE = "bundle"
    DATA_SOURCE = "data_source"
    DATASET = "dataset"
    GUIDELINE = "guideline"
    OTHER_RP = "other_rp"
    PUBLICATION = "publication"
    SERVICE = "service"
    TRAINING = "training"
    PROVIDER = "provider"
    SOFTWARE = "software"
    OFFER = "offer"


ALL_COLLECTION_LIST = [
    Collection.PUBLICATION,
    Collection.DATASET,
    Collection.SOFTWARE,
    Collection.SERVICE,
    Collection.DATA_SOURCE,
    Collection.TRAINING,
    Collection.GUIDELINE,
    Collection.BUNDLE,
    Collection.OTHER_RP,
    Collection.PROVIDER,
]


ResearchProductCollection: TypeAlias = Literal[
    Collection.PUBLICATION, Collection.DATASET, Collection.SOFTWARE, Collection.OTHER_RP
]


class PanelId(str, Enum):
    """Recommender collection names"""

    ALL = "all"
    DATA_SOURCES = "data_sources"
    DATASETS = "datasets"
    OTHER_RESEARCH_PRODUCT = "other_research_product"
    PUBLICATIONS = "publications"
    SERVICES = "services"
    TRAININGS = "trainings"
    SOFTWARE = "software"
    BUNDLE = "bundle"


# Mapping Solr collection names to recommender names [panel_id]
COLLECTION_TO_PANEL_ID_MAP = {
    Collection.ALL_COLLECTION: PanelId.ALL,
    Collection.DATA_SOURCE: PanelId.DATA_SOURCES,
    Collection.DATASET: PanelId.DATASETS,
    Collection.OTHER_RP: PanelId.OTHER_RESEARCH_PRODUCT,
    Collection.PUBLICATION: PanelId.PUBLICATIONS,
    Collection.SERVICE: PanelId.SERVICES,
    Collection.TRAINING: PanelId.TRAININGS,
    Collection.SOFTWARE: PanelId.SOFTWARE,
    Collection.BUNDLE: PanelId.BUNDLE,
}

PANEL_ID_OPTIONS = [
    PanelId.PUBLICATIONS,
    PanelId.DATASETS,
    PanelId.SOFTWARE,
    PanelId.TRAININGS,
    PanelId.OTHER_RESEARCH_PRODUCT,
    PanelId.SERVICES,
    PanelId.BUNDLE,
]

PROVIDER_QF = "title^100 description^10 scientific_domains^10"

SortUi: TypeAlias = Literal["dmr", "dlr", "mp", "r", "default", ""]

DEFAULT_SORT = ["score desc", "id asc"]

SORT_UI_TO_SORT_MAP = {
    "default": [],
    "dmr": ["publication_date desc"],
    "dlr": ["publication_date asc"],
    "mp": ["usage_counts_views desc", "usage_counts_downloads desc"],
    "r": ["usage_counts_views desc", "usage_counts_downloads desc"],
}
