# pylint: disable=undefined-variable, cyclic-import
"""Import transformations"""
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
from .project import ProjectTransformer
from .catalogue import CatalogueTransformer
from app.settings import settings

__all__ = ["transformers"]

transformers = {
    settings.SERVICE: ServiceTransformer,
    settings.DATASOURCE: DataSourceTransformer,
    settings.PROVIDER: ProviderTransformer,
    settings.OFFER: OfferTransformer,
    settings.BUNDLE: BundleTransformer,
    settings.GUIDELINE: transform_guidelines,
    settings.TRAINING: TrainingTransformer,
    settings.OTHER_RP: OtherRPTransformer,
    settings.SOFTWARE: SoftwareTransformer,
    settings.DATASET: DatasetTransformer,
    settings.PUBLICATION: PublicationTransformer,
    settings.ORGANISATION: OrganisationTransformer,
    settings.PROJECT: ProjectTransformer,
    settings.CATALOGUE: CatalogueTransformer,
}
