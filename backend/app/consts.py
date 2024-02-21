"""Common routes constants"""

from enum import Enum
from typing import Literal, TypeAlias


class ResourceType(str, Enum):
    """Resource type as the value of solr document `type` key"""

    PUBLICATION = "publication"
    DATASET = "dataset"
    SOFTWARE = "software"
    OTHER_RP = "other"
    SERVICE = "service"
    DATA_SOURCE = "data source"
    BUNDLE = "bundle"
    TRAINING = "training"
    GUIDELINE = "interoperability guideline"
    PROVIDER = "provider"
    ORGANISATION = "organisation"
    PROJECT = "project"
    CATALOGUE = "catalogue"


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
    ORGANISATION = "organisation"
    PROJECT = "project"
    CATALOGUE = "catalogue"


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
]


ResearchProductCollection: TypeAlias = Literal[
    Collection.PUBLICATION, Collection.DATASET, Collection.SOFTWARE, Collection.OTHER_RP
]

RP_AND_ALL_COLLECTIONS_LIST: list = [
    Collection.PUBLICATION,
    Collection.DATASET,
    Collection.SOFTWARE,
    Collection.OTHER_RP,
    Collection.ALL_COLLECTION,
]

ResearchProductType: TypeAlias = Literal["publication", "dataset", "software", "other"]


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

SPECIAL_COLLECTIONS = [Collection.PROJECT, Collection.ORGANISATION]

CATALOGUE_QF = "title^100 abbreviation^100 description^10 keywords_tg^10"

PROVIDER_QF = "title^100 description^10 scientific_domains^10"

PROJECT_QF = "title^ description^10 keywords_tg^10"

ORGANISATION_QF = "alternative_names title abbreviation"

DEFAULT_QF = (
    "title^100 author_names_tg^120 description^10 keywords_tg^10 tag_list_tg^10"
)

SortUi: TypeAlias = Literal["pdmr", "pdlr", "dmr", "dlr", "mp", "r", "default", ""]

DEFAULT_SORT = ["score desc", "id asc"]
DEFAULT_SPECIAL_COL_SORT = ["eosc_score desc", "score desc", "id asc"]

SORT_UI_TO_SORT_MAP = {
    "default": [],
    "dmr": ["publication_date desc"],
    "dlr": ["publication_date asc"],
    "mp": ["popularity desc"],
    "r": ["popularity desc"],
    "pdmr": ["start_date desc"],
    "pdlr": ["start_date asc"],
}

DOI_BASE_URL = "https://doi.org"
