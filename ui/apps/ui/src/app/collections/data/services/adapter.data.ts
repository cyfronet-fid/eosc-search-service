import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { IService } from './service.model';
import { COLLECTION } from './search-metadata.data';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import { transformLanguages } from '@collections/data/shared-tags';
import {
  parseStatistics,
  toKeywordsSecondaryTag,
} from '@collections/data/utils';
import { ConfigService } from '../../../services/config.service';

export const servicesAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (service: Partial<IService> & { id: string }): IResult => ({
    isSortCollectionScopeOff: true,
    isSortByRelevanceCollectionScopeOff: false,
    isResearchProduct: false,
    id: service.id,
    // basic information
    title: service.title?.join(' ') || '',
    description: service.description?.join(' ') || '',
    languages: transformLanguages(service?.language),
    horizontal: service?.horizontal,
    type: {
      label: service.type || '',
      value: service.type || '',
    },
    url: service.pid
      ? `${ConfigService.config?.marketplace_url}/services/${service.pid}`
      : '',
    orderUrl: service.pid
      ? `${ConfigService.config?.marketplace_url}/services/${service.pid}/offers`
      : '',
    collection: COLLECTION,
    coloredTags: [],
    tags: [
      {
        label: 'Organisation',
        values: toValueWithLabel(toArray(service.resource_organisation)),
        filter: 'resource_organisation',
      },
      {
        label: 'Scientific domain',
        values: toValueWithLabel(toArray(service.scientific_domains)),
        filter: 'scientific_domains',
      },
    ],
    secondaryTags: [
      // toDownloadsStatisticsSecondaryTag(service.usage_counts_downloads),
      // toViewsStatisticsSecondaryTag(service.usage_counts_views),
      toKeywordsSecondaryTag(service.tag_list ?? [], 'tag_list'),
    ],
    ...parseStatistics(service),
  }),
};
