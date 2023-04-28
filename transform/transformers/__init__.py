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
    GUIDELINE,
    OFFER,
    BUNDLE,
)
from .dataset import DatasetTransformer
from .publication import PublicationTransformer
from .software import SoftwareTransformer
from .other_rp import OtherRPTransformer
from .training import TrainingTransformer
from .service import ServiceTransformer
from .data_source import DataSourceTransformer
from .guideline import transform_guidelines
from .offer import OfferTransformer
from .bundle import BundleTransformer

__all__ = ["all_col_trans_map"]

# All collection
all_col_trans_map = {
    SERVICE: ServiceTransformer,
    DATASOURCE: DataSourceTransformer,
    OFFER: OfferTransformer,
    BUNDLE: BundleTransformer,
    GUIDELINE: transform_guidelines,
    TRAINING: TrainingTransformer,
    OTHER_RP: OtherRPTransformer,
    SOFTWARE: SoftwareTransformer,
    DATASET: DatasetTransformer,
    PUBLICATION: PublicationTransformer,
}
