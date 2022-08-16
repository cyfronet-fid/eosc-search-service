import { trainingsNavConfig } from './trainings/nav-config.data';
import { trainingsAdapter } from './trainings/adapter.data';
import { trainingsSearchMetadata } from './trainings/search-metadata.data';
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
import { servicesAdapter } from './services/adapter.data';
import { allCollectionsFilters } from './all/filters.data';
import { publicationsFilters } from './publications/filters.data';
import { datasetsFilters } from './datasets/filters.data';
import { softwareFilters } from './software/filters.data';
import { servicesFilters } from './services/filters.data';
import { trainingsFilters } from './trainings/filters.data';
import {
  URL_PARAM_NAME as ALL_COLLECTIONS_URL_PARAM_NAME,
  allCollectionsNavConfig,
} from './all/nav-config.data';
import { publicationsNavConfig } from './publications/nav-config.data';
import { datasetsNavConfig } from './datasets/nav-config.data';
import { softwareNavConfig } from './software/nav-config.data';
import { servicesNavConfig } from './services/nav-config.data';
import { allCollectionsSearchMetadata } from './all/search-metadata.data';
import { publicationsSearchMetadata } from './publications/search-metadata.data';
import { datasetsSearchMetadata } from './datasets/search-metadata.data';
import { softwareSearchMetadata } from './software/search-metadata.data';
import { servicesSearchMetadata } from './services/search-metadata.data';

export const DEFAULT_COLLECTION_ID = ALL_COLLECTIONS_URL_PARAM_NAME;
export const ADAPTERS: IAdapter[] = [
  allCollectionsAdapter,
  publicationsAdapter,
  datasetsAdapter,
  softwareAdapter,
  servicesAdapter,
  trainingsAdapter,
];
export const FILTERS: IFiltersConfig[] = [
  allCollectionsFilters,
  publicationsFilters,
  datasetsFilters,
  softwareFilters,
  servicesFilters,
  trainingsFilters,
];
export const NAV_CONFIGS: ICollectionNavConfig[] = [
  allCollectionsNavConfig,
  publicationsNavConfig,
  datasetsNavConfig,
  softwareNavConfig,
  servicesNavConfig,
  trainingsNavConfig,
];
export const SEARCH_METADATA: ICollectionSearchMetadata[] = [
  allCollectionsSearchMetadata,
  publicationsSearchMetadata,
  datasetsSearchMetadata,
  softwareSearchMetadata,
  servicesSearchMetadata,
  trainingsSearchMetadata,
];
