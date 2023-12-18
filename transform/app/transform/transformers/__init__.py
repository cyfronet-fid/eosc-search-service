# pylint: disable=undefined-variable, cyclic-import
"""Import transformations"""
from ..schemas.properties.env import (
    DATASET,
    OTHER_RP,
    PUBLICATION,
    BUNDLE,
    GUIDELINE,
    DATASOURCE,
    OFFER,
    PROVIDER,
    SERVICE,
    SOFTWARE,
    TRAINING,
    ORGANISATION,
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
from .provider import ProviderTransformer
from .organisation import OrganisationTransformer

__all__ = ["transformers"]

transformers = {
    SERVICE: ServiceTransformer,
    DATASOURCE: DataSourceTransformer,
    PROVIDER: ProviderTransformer,
    OFFER: OfferTransformer,
    BUNDLE: BundleTransformer,
    GUIDELINE: transform_guidelines,
    TRAINING: TrainingTransformer,
    OTHER_RP: OtherRPTransformer,
    SOFTWARE: SoftwareTransformer,
    DATASET: DatasetTransformer,
    PUBLICATION: PublicationTransformer,
    ORGANISATION: OrganisationTransformer,
}
