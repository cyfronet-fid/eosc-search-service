"""Bundles expected search engine schema"""

from datetime import date
from typing import List

from pydantic import AnyHttpUrl, BaseModel, EmailStr


class BundleSESchema(BaseModel):
    """
    Pydantic model representing the expected search engine schema for a bundle after transformations.

    Attributes:
        bundle_goals (List[str]):
            A list of goals associated with the bundle. Used in tags.
        catalogue (str):
            TODO replace with catalogues. Make sure that backend/frontend are not using it.
            A catalogue associated with the bundle.
        catalogues (List[str]):
            A list of catalogues associated with the bundle. Used in filters.
        capabilities_of_goals (List[str]):
            A list of capabilities related to the bundle goals. Used in filters and tags
        dedicated_for (List[str]):
            A list of dedicated purposes for the bundle. Used in filters.
        description (str):
            A detailed description of the bundle. Used for searching.
        eosc_if (List[str]):
            TODO Add description - strings solr type. Used in filters and second tags
        eosc_if_tg (List[str]):
            The same as eosc_if but solr type: text general. Used in searching.
        id (str):
            Unique identifier for the bundle.
        iid (int):
            TODO probably keep only in db - scope for other refactor
            Internal identifier for the bundle.
        main_offer_id (str):
            TODO probably keep only in db - scope for other refactor
            Identifier for the main offer associated with the bundle.
        offer_ids (List[int]):
            TODO probably keep only in db - scope for other refactor
            A list of offer identifiers associated with the bundle.
        popularity (int):
            Popularity score of the bundle. Used in sorting.
        providers (List[str]):
            A list of providers associated with the bundle. Used in filters.
        publication_date (date):
            The date when the bundle was published. Used in ordering.
        resource_organisation (str):
            The organisation responsible for the bundle. Used in filters
        scientific_domains (List[str]):
            A list of scientific domains that the bundle pertains to. Used in filters and tags.
        service_id (int):
            TODO probably keep only in db - scope for other refactor
            Identifier for the service associated with the bundle.
        title (str):
            Title of the bundle. Used in searching
        type (str):
            Data type = "bundle". Used in tabs and tags
        unified_categories (List[str]):
            A list of unified categories for the bundle. Used in filters
        usage_counts_downloads (int):
            The number of times the bundle has been downloaded. Part of popularity.
        usage_counts_views (int):
            The number of times the bundle has been viewed. Part of popularity.
    """

    bundle_goals: List[str]
    catalogue: str  # TODO replace with catalogues. Make sure that backend/frontend are not using it.
    catalogues: List[str]
    capabilities_of_goals: List[str]
    dedicated_for: List[str]
    description: str
    eosc_if: List[str]
    eosc_if_tg: List[str]
    id: str
    iid: int
    main_offer_id: str
    offer_ids: List[int]
    popularity: int
    providers: List[str]
    publication_date: date
    resource_organisation: str
    scientific_domains: List[str]
    service_id: int
    title: str
    type: str
    unified_categories: List[str]
    usage_counts_downloads: int
    usage_counts_views: int

    """
    Transformations necessary to convert BundleInputSchema to BundleSESchema
        - delete "contact_email"
        - delete "helpdesk_url"
        - delete "related_training"
        - delete "updated_at"
        - rename "target_users" -> "dedicated_for"
        - rename "name" -> "title"
        - rename "research_steps" -> "unified_categories"
        - add type = "bundle"
        - add popularity using harvest_popularity func: popularity = usage_counts_downloads + usage_counts_views
        - cast:
            .withColumn("publication_date", col("publication_date").cast("date")
        - convert ids:
            df = self.convert_int_ids(df, columns=(ID,), increment=self.id_increment)
            # Increase offers IDs to match their increased IDs
            df = self.convert_int_ids(df, columns=("main_offer_id",), increment=settings.OFFER_IDS_INCREMENTOR)
            df = self.convert_arr_ids(df, columns=("offer_ids",), increment=settings.OFFER_IDS_INCREMENTOR)
    """
