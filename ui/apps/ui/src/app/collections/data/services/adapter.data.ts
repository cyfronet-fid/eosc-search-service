import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { IService } from './service.model';
import { IDataSource } from '../data-sources/data-source.model';
import { COLLECTION } from './search-metadata.data';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import { transformLanguages } from '@collections/data/shared-tags';
import {
  parseStatistics,
  toInterPatternsSecondaryTag,
  toKeywordsSecondaryTag,
} from '@collections/data/utils';
import { ConfigService } from '../../../services/config.service';

const setType = (type: string | undefined) => {
  if (type === 'data source') {
    return {
      label: type,
      value: type?.replace(/ +/gm, '-'),
    };
  } else {
    return {
      label: type || '',
      value: type || '',
    };
  }
};

export const servicesAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (
    service: Partial<IService & IDataSource> & { id: string }
  ): IResult => ({
    isResearchProduct: false,
    id: service.id,
    // basic information
    title: service.title?.join(' ') || '',
    description: service.description?.join(' ') || '',
    languages: transformLanguages(service?.language),
    horizontal: service?.horizontal,
    type: setType(service.type),
    url: `${
      ConfigService.config?.marketplace_url
    }/services/${encodeURIComponent(service.pid || '')}`,
    logoUrl: `${
      ConfigService.config?.marketplace_url
    }/services/${encodeURIComponent(service.pid || '')}/logo`,
    orderUrl: `${
      ConfigService.config?.marketplace_url
    }/services/${encodeURIComponent(service.pid || '')}/offers`,
    collection: COLLECTION,
    coloredTags: [],
    tags: [
      {
        label: 'EOSC Node',
        values: toValueWithLabel(toArray(service.node)),
        filter: 'node',
        showMoreThreshold: 4,
      },
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
      {
        label: 'Interoperability guideline',
        values: toValueWithLabel(toArray(service.guidelines)),
        filter: 'guidelines_str',
      },
    ],
    secondaryTags: [
      toInterPatternsSecondaryTag(service.eosc_if ?? [], 'eosc_if'),
      toKeywordsSecondaryTag(service.keywords ?? [], 'keywords'),
    ],
    ...parseStatistics(service),
  }),
};
