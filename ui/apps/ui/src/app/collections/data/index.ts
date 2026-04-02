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
import { adapterNavConfig } from '@collections/data/adapters/nav-config.data';
import { deployableServiceNavConfig } from '@collections/data/deployable-services/nav-config.data';

import { trainingsAdapter } from './trainings/adapter.data';
import { guidelinesAdapter } from './guidelines/adapter.data';
import { allCollectionsAdapter } from './all/adapter.data';
import { publicationsAdapter } from './publications/adapter.data';
import { datasetsAdapter } from './datasets/adapter.data';
import { softwareAdapter } from './software/adapter.data';
import { dataSourcesAdapter } from './data-sources/adapter.data';
import { providersAdapter } from '@collections/data/providers/adapter.data';
import { servicesAdapter } from '@collections/data/services/adapter.data';
import { cataloguesAdapter } from './catalogues/adapter.data';
import { adaptersAdapter } from './adapters/adapter.data';
import { deployableServiceAdapter } from '@collections/data/deployable-services/adapter.data';

import { trainingsSearchMetadata } from './trainings/search-metadata.data';
import { guidelinesSearchMetadata } from './guidelines/search-metadata.data';
import { providersSearchMetadata } from './providers/search-metadata.data';
import { allCollectionsSearchMetadata } from './all/search-metadata.data';
import { publicationsSearchMetadata } from './publications/search-metadata.data';
import { datasetsSearchMetadata } from './datasets/search-metadata.data';
import { softwareSearchMetadata } from './software/search-metadata.data';
import { dataSourcesSearchMetadata } from './data-sources/search-metadata.data';
import { servicesSearchMetadata } from '@collections/data/services/search-metadata.data';
import { cataloguesSearchMetadata } from './catalogues/search-metadata.data';
import { adapterSearchMetadata } from './adapters/search-metadata.data';
import { deployableServiceSearchMetadata } from '@collections/data/deployable-services/search-metadata.data';

import { allCollectionsFilters } from './all/filters.data';
import { publicationsFilters } from './publications/filters.data';
import { datasetsFilters } from './datasets/filters.data';
import { softwareFilters } from './software/filters.data';
import { dataSourcesFilters } from './data-sources/filters.data';
import { trainingsFilters } from './trainings/filters.data';
import { guidelinesFilters } from './guidelines/filters.data';
import { servicesFilters } from '@collections/data/services/filters.data';
import { providersFilters } from '@collections/data/providers/filters.data';
import { catalogueFilters } from './catalogues/filters.data';
import { adapterFilters } from './adapters/filters.data';
import { deployableServiceFilters } from './deployable-services/filters.data';

import { excludedPublicationsFilters } from '@collections/data/publications/excluded.data';
import { excludedDatasetsFilters } from '@collections/data/datasets/excluded.data';
import { excludedAllCollectionsFilters } from '@collections/data/all/excluded.data';
import { excludedSoftwareFilters } from '@collections/data/software/excluded.data';
import { excludedServicesFilters } from '@collections/data/services/excluded.data';
import { excludedDataSourcesFilters } from '@collections/data/data-sources/excluded.data';
import { excludedTrainingsFilters } from '@collections/data/trainings/excluded.data';
import { excludedGuidelinesFilters } from '@collections/data/guidelines/excluded.data';
import { excludedProvidersFilters } from '@collections/data/providers/excluded.data';
import { excludedCatalogueFilters } from './catalogues/excluded.data';
import { excludedAdapterFilters } from './adapters/excluded.data';
import { excludedDeployableServiceFilters } from '@collections/data/deployable-services/excluded.data';

import { validateCollections } from '@collections/data/validators';

export const DEFAULT_COLLECTION_ID = ALL_COLLECTIONS_URL_PARAM_NAME;
export const ADAPTERS: IAdapter[] = [
  allCollectionsAdapter,
  datasetsAdapter,
  publicationsAdapter,
  softwareAdapter,
  deployableServiceAdapter,
  servicesAdapter,
  dataSourcesAdapter,
  cataloguesAdapter,
  providersAdapter,
  adaptersAdapter,
  guidelinesAdapter,
  trainingsAdapter,
];
export const FILTERS: IFiltersConfig[] = [
  allCollectionsFilters,
  datasetsFilters,
  publicationsFilters,
  softwareFilters,
  deployableServiceFilters,
  servicesFilters,
  dataSourcesFilters,
  catalogueFilters,
  providersFilters,
  adapterFilters,
  guidelinesFilters,
  trainingsFilters,
];

// Excluded filters according to adjustments in
// https://github.com/cyfronet-fid/eosc-search-service/issues/597
export const EXCLUDED_FILTERS: IExcludedFiltersConfig[] = [
  excludedAllCollectionsFilters,
  excludedDatasetsFilters,
  excludedPublicationsFilters,
  excludedSoftwareFilters,
  excludedDeployableServiceFilters,
  excludedServicesFilters,
  excludedDataSourcesFilters,
  excludedCatalogueFilters,
  excludedProvidersFilters,
  excludedAdapterFilters,
  excludedGuidelinesFilters,
  excludedTrainingsFilters,
];

export const NAV_CONFIGS: ICollectionNavConfig[] = [
  allCollectionsNavConfig,
  datasetsNavConfig,
  publicationsNavConfig,
  softwareNavConfig,
  deployableServiceNavConfig,
  servicesNavConfig,
  dataSourcesNavConfig,
  cataloguesNavConfig,
  providersNavConfig,
  adapterNavConfig,
  guidelinesNavConfig,
  trainingsNavConfig,
];
export const SEARCH_METADATA: ICollectionSearchMetadata[] = [
  allCollectionsSearchMetadata,
  datasetsSearchMetadata,
  publicationsSearchMetadata,
  softwareSearchMetadata,
  deployableServiceSearchMetadata,
  servicesSearchMetadata,
  dataSourcesSearchMetadata,
  cataloguesSearchMetadata,
  providersSearchMetadata,
  adapterSearchMetadata,
  guidelinesSearchMetadata,
  trainingsSearchMetadata,
];

validateCollections(
  ADAPTERS,
  FILTERS,
  EXCLUDED_FILTERS,
  NAV_CONFIGS,
  SEARCH_METADATA
);
