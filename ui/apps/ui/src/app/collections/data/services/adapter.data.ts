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

export const getServiceOrderUrl = (slug?: string) => {
  if (!slug) {
    slug = '';
  }
  return `${ConfigService.config?.marketplace_url}/services/${slug}/offers`;
};

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
    redirectUrl: service.slug
      ? `${ConfigService.config?.marketplace_url}/services/${service.slug}/offers`
      : '',
    logoUrl: service.slug
      ? `${ConfigService.config?.marketplace_url}/services/${service.slug}/logo`
      : '',
    orderUrl: getServiceOrderUrl(service.slug),
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
      {
        label: 'Interoperability guideline',
        values: toValueWithLabel(toArray(service.guidelines)),
        filter: 'guidelines_str',
      },
    ],
    secondaryTags: [
      toInterPatternsSecondaryTag(service.eosc_if ?? [], 'eosc_if'),
      toKeywordsSecondaryTag(service.tag_list ?? [], 'tag_list'),
    ],
    ...parseStatistics(service),
  }),
};
