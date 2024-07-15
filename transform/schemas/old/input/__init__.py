"""Import input schemas"""

from .bundle import bundle_input_schema
from .catalogue import catalogue_input_schema
from .data_source import data_source_input_schema
from .dataset import dataset_input_schema
from .guideline import guideline_input_schema
from .offer import offer_input_schema
from .organisation import organisation_input_schema
from .other_rp import other_rp_input_schema
from .project import project_input_schema
from .provider import provider_input_schema
from .publication import publication_input_schema
from .service import service_input_schema
from .software import software_input_schema
from .training import training_input_schema

__all__ = [
    "bundle_input_schema",
    "data_source_input_schema",
    "dataset_input_schema",
    "guideline_input_schema",
    "offer_input_schema",
    "other_rp_input_schema",
    "provider_input_schema",
    "publication_input_schema",
    "service_input_schema",
    "software_input_schema",
    "training_input_schema",
    "organisation_input_schema",
    "project_input_schema",
    "catalogue_input_schema",
]
