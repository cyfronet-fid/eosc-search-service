import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { IService } from './service.model';
import { COLLECTION } from './search-metadata.data';
import { parseStatistics } from '@collections/data/utils';
import { toArray, toValueWithLabel } from '@collections/filters-serializers/utils';
import {
  toAccessRightColoredTag,
  toLanguageColoredTag,
} from '@collections/data/shared-tags';

export const servicesAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (service: Partial<IService> & { id: string }): IResult => ({
    id: service.id,
    // basic information
    title: service.title?.join(' ') || '',
    description: service.description?.join(' ') || '',
    type: {
      label: service.type || '',
      value: service.type || '',
    },
    url: service.pid
      ? `https://marketplace.eosc-portal.eu/services/${service.pid}`
      : '',
    collection: COLLECTION,
    coloredTags: [
      toAccessRightColoredTag(service?.best_access_right),
      toLanguageColoredTag(service?.language),
    ],
    tags: [
      {
        label: 'Scientific domain',
        values: toValueWithLabel(toArray(service.scientific_domains)),
        filter: 'scientific_domains',
      },
      {
        label: 'Organisation',
        values: toValueWithLabel(toArray(service.resource_organisation)),
        filter: 'resource_organisation',
      },
    ],
    ...parseStatistics(service),
  }),
};
