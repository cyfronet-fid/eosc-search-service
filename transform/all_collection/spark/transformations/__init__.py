# pylint: disable=undefined-variable, cyclic-import
"""Import transformations"""
from transform.all_collection.spark.utils.loader import (
    DATASET,
    PUBLICATION,
    SOFTWARE,
    TRAINING,
    SERVICE,
    DATASOURCE,
)
from .datasets_transform import transform_datasets
from .publications_transfrom import transform_publications
from .software_transfrom import transform_software
from .trainings_transform import transform_trainings
from .services_transform import transform_services, transform_data_sources

__all__ = [
    ["trans_map"]
    + datasets_transform.__all__
    + publications_transfrom.__all__
    + software_transfrom.__all__
    + trainings_transform.__all__
    + services_transform.__all__
]

trans_map = {
    DATASET: transform_datasets,
    PUBLICATION: transform_publications,
    SOFTWARE: transform_software,
    TRAINING: transform_trainings,
    SERVICE: transform_services,
    DATASOURCE: transform_data_sources,
}
