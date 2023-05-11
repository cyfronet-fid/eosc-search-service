import { trainingsNavConfig } from './trainings/nav-config.data';
import { guidelinesNavConfig } from './guidelines/nav-config.data';
import { trainingsAdapter } from './trainings/adapter.data';
import { guidelinesAdapter } from './guidelines/adapter.data';
import { trainingsSearchMetadata } from './trainings/search-metadata.data';
import { guidelinesSearchMetadata } from './guidelines/search-metadata.data';
import {
  IAdapter,
  ICollectionNavConfig,
  ICollectionSearchMetadata,
  IFiltersConfig,
} from '../repositories/types';
import { allCollectionsAdapter } from './all/adapter.data';
import { publicationsAdapter } from './publications/adapter.data';
import { datasetsAdapter } from './datasets/adapter.data';
import { softwareAdapter } from './software/adapter.data';
import { dataSourcesAdapter } from './data-sources/adapter.data';
import { allCollectionsFilters } from './all/filters.data';
import { publicationsFilters } from './publications/filters.data';
import { datasetsFilters } from './datasets/filters.data';
import { softwareFilters } from './software/filters.data';
import { dataSourcesFilters } from './data-sources/filters.data';
import { trainingsFilters } from './trainings/filters.data';
import { guidelinesFilters } from './guidelines/filters.data';
import {
  URL_PARAM_NAME as ALL_COLLECTIONS_URL_PARAM_NAME,
  allCollectionsNavConfig,
} from './all/nav-config.data';
import { publicationsNavConfig } from './publications/nav-config.data';
import { datasetsNavConfig } from './datasets/nav-config.data';
import { softwareNavConfig } from './software/nav-config.data';
import { dataSourcesNavConfig } from './data-sources/nav-config.data';
import { allCollectionsSearchMetadata } from './all/search-metadata.data';
import { publicationsSearchMetadata } from './publications/search-metadata.data';
import { datasetsSearchMetadata } from './datasets/search-metadata.data';
import { softwareSearchMetadata } from './software/search-metadata.data';
import { dataSourcesSearchMetadata } from './data-sources/search-metadata.data';
import { servicesAdapter } from '@collections/data/services/adapter.data';
import { servicesFilters } from '@collections/data/services/filters.data';
import { servicesSearchMetadata } from '@collections/data/services/search-metadata.data';

import { validateCollections } from '@collections/data/validators';
import { servicesNavConfig } from '@collections/data/services/nav-config.data';
import { otherResourcesProductsFilters } from '@collections/data/other-resources-products/filters.data';
import { othersResourcesProductsNavConfig } from '@collections/data/other-resources-products/nav-config.data';
import { otherResourcesProductsSearchMetadata } from '@collections/data/other-resources-products/search-metadata.data';
import { otherResourcesProductsAdapter } from '@collections/data/other-resources-products/adapter.data';

export const DEFAULT_COLLECTION_ID = ALL_COLLECTIONS_URL_PARAM_NAME;
export const ADAPTERS: IAdapter[] = [
  allCollectionsAdapter,
  publicationsAdapter,
  datasetsAdapter,
  softwareAdapter,
  servicesAdapter,
  dataSourcesAdapter,
  trainingsAdapter,
  // TODO: temporarily off
  // guidelinesAdapter,
  otherResourcesProductsAdapter,
];
export const FILTERS: IFiltersConfig[] = [
  allCollectionsFilters,
  publicationsFilters,
  datasetsFilters,
  softwareFilters,
  servicesFilters,
  dataSourcesFilters,
  trainingsFilters,
  // TODO: temporarily off
  // guidelinesFilters,
  otherResourcesProductsFilters,
];
export const NAV_CONFIGS: ICollectionNavConfig[] = [
  allCollectionsNavConfig,
  publicationsNavConfig,
  datasetsNavConfig,
  softwareNavConfig,
  servicesNavConfig,
  dataSourcesNavConfig,
  trainingsNavConfig,
  // TODO: temporarily off
  // guidelinesNavConfig,
  othersResourcesProductsNavConfig,
];
export const SEARCH_METADATA: ICollectionSearchMetadata[] = [
  allCollectionsSearchMetadata,
  publicationsSearchMetadata,
  datasetsSearchMetadata,
  softwareSearchMetadata,
  servicesSearchMetadata,
  dataSourcesSearchMetadata,
  trainingsSearchMetadata,
  // TODO: temporarily off
  // guidelinesSearchMetadata,
  otherResourcesProductsSearchMetadata,
];

validateCollections(ADAPTERS, FILTERS, NAV_CONFIGS, SEARCH_METADATA);
