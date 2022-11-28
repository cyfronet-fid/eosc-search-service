import { trainingsNavConfig } from './trainings/nav-config.data';
import { trainingsSearchMetadata } from './trainings/search-metadata.data';
import {
  ICollectionNavConfig,
  ICollectionSearchMetadata,
  IFiltersConfig,
} from '../repositories/types';
import { allCollectionsFilters } from './all/filters.data';
import { publicationsFilters } from './publications/filters.data';
import { datasetsFilters } from './datasets/filters.data';
import { softwareFilters } from './software/filters.data';
import { dataSourcesFilters } from './data-sources/filters.data';
import { trainingsFilters } from './trainings/filters.data';
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
import { servicesFilters } from '@collections/data/services/filters.data';
import { servicesSearchMetadata } from '@collections/data/services/search-metadata.data';

import { validateCollections } from '@collections/data/validators';
import { servicesNavConfig } from '@collections/data/services/nav-config.data';
import { otherResourcesProductsFilters } from '@collections/data/other-resources-products/filters.data';
import { othersResourcesProductsNavConfig } from '@collections/data/other-resources-products/nav-config.data';
import { otherResourcesProductsSearchMetadata } from '@collections/data/other-resources-products/search-metadata.data';

export const DEFAULT_COLLECTION_ID = ALL_COLLECTIONS_URL_PARAM_NAME;

export const FILTERS: IFiltersConfig[] = [
  allCollectionsFilters,
  publicationsFilters,
  datasetsFilters,
  softwareFilters,
  servicesFilters,
  dataSourcesFilters,
  trainingsFilters,
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
  otherResourcesProductsSearchMetadata,
];

validateCollections(FILTERS, NAV_CONFIGS, SEARCH_METADATA);
