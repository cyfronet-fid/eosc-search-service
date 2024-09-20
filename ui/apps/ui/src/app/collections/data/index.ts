import {
  IAdapter,
  ICollectionNavConfig,
  ICollectionSearchMetadata,
  IExcludedFiltersConfig,
  IFiltersConfig,
} from '../repositories/types';
import { trainingsNavConfig } from './trainings/nav-config.data';
import { guidelinesNavConfig } from './guidelines/nav-config.data';
import { providersNavConfig } from '@collections/data/providers/nav-config.data';
import { projectNavConfig } from './projects/nav-config.data';
import { organisationsNavConfig } from './organisations/nav-config.data';
import { cataloguesNavConfig } from './catalogues/nav-config.data';
import {
  URL_PARAM_NAME as ALL_COLLECTIONS_URL_PARAM_NAME,
  allCollectionsNavConfig,
} from './all/nav-config.data';
import { publicationsNavConfig } from './publications/nav-config.data';
import { datasetsNavConfig } from './datasets/nav-config.data';
import { softwareNavConfig } from './software/nav-config.data';
import { dataSourcesNavConfig } from './data-sources/nav-config.data';
import { servicesNavConfig } from '@collections/data/services/nav-config.data';
import { othersResourcesProductsNavConfig } from '@collections/data/other-resources-products/nav-config.data';
import { bundlesNavConfig } from '@collections/data/bundles/nav-config.data';

import { trainingsAdapter } from './trainings/adapter.data';
import { guidelinesAdapter } from './guidelines/adapter.data';
import { allCollectionsAdapter } from './all/adapter.data';
import { publicationsAdapter } from './publications/adapter.data';
import { datasetsAdapter } from './datasets/adapter.data';
import { softwareAdapter } from './software/adapter.data';
import { dataSourcesAdapter } from './data-sources/adapter.data';
import { providersAdapter } from '@collections/data/providers/adapter.data';
import { projectsAdapter } from './projects/adapter.data';
import { organisationsAdapter } from './organisations/adapter.data';
import { servicesAdapter } from '@collections/data/services/adapter.data';
import { otherResourcesProductsAdapter } from '@collections/data/other-resources-products/adapter.data';
import { bundlesAdapter } from '@collections/data/bundles/adapter.data';
import { cataloguesAdapter } from './catalogues/adapter.data';

import { plDatasetsAdapter } from '../pl-data/datasets/adapter.data';
import { plAllCollectionsAdapter } from '../pl-data/all/adapter.data';
import { plProvidersAdapter } from '../pl-data/providers/adapter.data';
import { plServicesAdapter } from '../pl-data/services/adapter.data';
import { plDataSourcesAdapter } from '../pl-data/data-sources/adapter.data';

import { trainingsSearchMetadata } from './trainings/search-metadata.data';
import { guidelinesSearchMetadata } from './guidelines/search-metadata.data';
import { providersSearchMetadata } from './providers/search-metadata.data';
import { projectsSearchMetadata } from './projects/search-metadata.data';
import { organisationsSearchMetadata } from './organisations/search-metadata.data';
import { allCollectionsSearchMetadata } from './all/search-metadata.data';
import { publicationsSearchMetadata } from './publications/search-metadata.data';
import { datasetsSearchMetadata } from './datasets/search-metadata.data';
import { softwareSearchMetadata } from './software/search-metadata.data';
import { dataSourcesSearchMetadata } from './data-sources/search-metadata.data';
import { servicesSearchMetadata } from '@collections/data/services/search-metadata.data';
import { otherResourcesProductsSearchMetadata } from '@collections/data/other-resources-products/search-metadata.data';
import { bundlesSearchMetadata } from '@collections/data/bundles/search-metadata.data';
import { cataloguesSearchMetadata } from './catalogues/search-metadata.data';

import { allCollectionsFilters } from './all/filters.data';
import { publicationsFilters } from './publications/filters.data';
import { datasetsFilters } from './datasets/filters.data';
import { softwareFilters } from './software/filters.data';
import { dataSourcesFilters } from './data-sources/filters.data';
import { trainingsFilters } from './trainings/filters.data';
import { guidelinesFilters } from './guidelines/filters.data';
import { servicesFilters } from '@collections/data/services/filters.data';
import { providersFilters } from '@collections/data/providers/filters.data';
import { projectsFilters } from './projects/filters.data';
import { organisationsFilters } from './organisations/filters.data';
import { otherResourcesProductsFilters } from '@collections/data/other-resources-products/filters.data';
import { bundlesFilters } from '@collections/data/bundles/filters.data';
import { catalogueFilters } from './catalogues/filters.data';

import { excludedPublicationsFilters } from '@collections/data/publications/excluded.data';
import { excludedDatasetsFilters } from '@collections/data/datasets/excluded.data';
import { excludedAllCollectionsFilters } from '@collections/data/all/excluded.data';
import { excludedSoftwareFilters } from '@collections/data/software/excluded.data';
import { excludedServicesFilters } from '@collections/data/services/excluded.data';
import { excludedDataSourcesFilters } from '@collections/data/data-sources/excluded.data';
import { excludedTrainingsFilters } from '@collections/data/trainings/excluded.data';
import { excludedOtherResourcesProductsFilters } from '@collections/data/other-resources-products/excluded.data';
import { excludedGuidelinesFilters } from '@collections/data/guidelines/excluded.data';
import { excludedBundlesFilters } from '@collections/data/bundles/excluded.data';
import { excludedProvidersFilters } from '@collections/data/providers/excluded.data';
import { excludedProjectFilters } from './projects/excluded.data';
import { excludedOrganisationFilters } from './organisations/excluded.data';
import { excludedCatalogueFilters } from './catalogues/excluded.data';

import { validateCollections } from '@collections/data/validators';

export const DEFAULT_COLLECTION_ID = ALL_COLLECTIONS_URL_PARAM_NAME;
export const ADAPTERS: IAdapter[] = [
  allCollectionsAdapter,
  publicationsAdapter,
  datasetsAdapter,
  softwareAdapter,
  otherResourcesProductsAdapter,
  servicesAdapter,
  dataSourcesAdapter,
  bundlesAdapter,
  trainingsAdapter,
  guidelinesAdapter,
  providersAdapter,
  projectsAdapter,
  organisationsAdapter,
  cataloguesAdapter,
];

export const PL_ADAPTERS: IAdapter[] = [
  plAllCollectionsAdapter,
  publicationsAdapter,
  plDatasetsAdapter,
  plServicesAdapter,
  plDataSourcesAdapter,
  plProvidersAdapter,
];

export const FILTERS: IFiltersConfig[] = [
  allCollectionsFilters,
  publicationsFilters,
  datasetsFilters,
  softwareFilters,
  otherResourcesProductsFilters,
  servicesFilters,
  dataSourcesFilters,
  bundlesFilters,
  trainingsFilters,
  guidelinesFilters,
  providersFilters,
  projectsFilters,
  organisationsFilters,
  catalogueFilters,
];

export const PL_FILTERS: IFiltersConfig[] = [
  allCollectionsFilters,
  publicationsFilters,
  datasetsFilters,
  servicesFilters,
  dataSourcesFilters,
  providersFilters,
];

// Excluded filters according to adjustments in
// https://github.com/cyfronet-fid/eosc-search-service/issues/597
export const EXCLUDED_FILTERS: IExcludedFiltersConfig[] = [
  excludedAllCollectionsFilters,
  excludedPublicationsFilters,
  excludedDatasetsFilters,
  excludedSoftwareFilters,
  excludedOtherResourcesProductsFilters,
  excludedServicesFilters,
  excludedDataSourcesFilters,
  excludedBundlesFilters,
  excludedTrainingsFilters,
  excludedGuidelinesFilters,
  excludedProvidersFilters,
  excludedProjectFilters,
  excludedOrganisationFilters,
  excludedCatalogueFilters,
];

export const PL_EXCLUDED_FILTERS: IExcludedFiltersConfig[] = [
  excludedAllCollectionsFilters,
  excludedPublicationsFilters,
  excludedDatasetsFilters,
  excludedServicesFilters,
  excludedDataSourcesFilters,
  excludedProvidersFilters,
];

export const NAV_CONFIGS: ICollectionNavConfig[] = [
  allCollectionsNavConfig,
  publicationsNavConfig,
  datasetsNavConfig,
  softwareNavConfig,
  othersResourcesProductsNavConfig,
  servicesNavConfig,
  dataSourcesNavConfig,
  bundlesNavConfig,
  trainingsNavConfig,
  guidelinesNavConfig,
  providersNavConfig,
  projectNavConfig,
  organisationsNavConfig,
  cataloguesNavConfig,
];

export const PL_NAV_CONFIGS: ICollectionNavConfig[] = [
  allCollectionsNavConfig,
  publicationsNavConfig,
  datasetsNavConfig,
  servicesNavConfig,
  dataSourcesNavConfig,
  providersNavConfig,
];

export const SEARCH_METADATA: ICollectionSearchMetadata[] = [
  allCollectionsSearchMetadata,
  publicationsSearchMetadata,
  datasetsSearchMetadata,
  softwareSearchMetadata,
  otherResourcesProductsSearchMetadata,
  servicesSearchMetadata,
  dataSourcesSearchMetadata,
  bundlesSearchMetadata,
  trainingsSearchMetadata,
  guidelinesSearchMetadata,
  providersSearchMetadata,
  projectsSearchMetadata,
  organisationsSearchMetadata,
  cataloguesSearchMetadata,
];

export const PL_SEARCH_METADATA: ICollectionSearchMetadata[] = [
  allCollectionsSearchMetadata,
  publicationsSearchMetadata,
  datasetsSearchMetadata,
  servicesSearchMetadata,
  dataSourcesSearchMetadata,
  providersSearchMetadata,
];

validateCollections(
  ADAPTERS,
  FILTERS,
  EXCLUDED_FILTERS,
  NAV_CONFIGS,
  SEARCH_METADATA
);

validateCollections(
  PL_ADAPTERS,
  PL_FILTERS,
  PL_EXCLUDED_FILTERS,
  PL_NAV_CONFIGS,
  PL_SEARCH_METADATA
);
