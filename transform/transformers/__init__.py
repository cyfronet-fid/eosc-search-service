# pylint: disable=undefined-variable, cyclic-import
"""Import transformations"""
from transform.utils.loader import (
    DATASET,
    PUBLICATION,
    SOFTWARE,
    OTHER_RP,
    TRAINING,
    SERVICE,
    DATASOURCE,
)
from .dataset import DatasetTransformer
from .publication import PublicationTransformer
from .software import SoftwareTransformer
from .other_rp import OtherRPTransformer
from .training import TrainingTransformer
from .service import ServiceTransformer
from .data_source import DataSourceTransformer

__all__ = ["trans_map"]

trans_map = {
    DATASET: DatasetTransformer,
    PUBLICATION: PublicationTransformer,
    SOFTWARE: SoftwareTransformer,
    OTHER_RP: OtherRPTransformer,
    TRAINING: TrainingTransformer,
    SERVICE: ServiceTransformer,
    DATASOURCE: DataSourceTransformer,
}
