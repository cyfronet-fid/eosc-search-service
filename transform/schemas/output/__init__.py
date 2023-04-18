"""Import output schemas"""
from .data_source import data_source_output_schema
from .dataset import dataset_output_schema
from .guideline import guideline_output_schema
from .other_rp import other_rp_output_schema
from .provider import provider_output_schema
from .publication import publication_output_schema
from .service import service_output_schema
from .software import software_output_schema
from .training import training_output_schema

__all__ = [
    "data_source_output_schema",
    "dataset_output_schema",
    "guideline_output_schema",
    "other_rp_output_schema",
    "provider_output_schema",
    "publication_output_schema",
    "service_output_schema",
    "software_output_schema",
    "training_output_schema",
]
