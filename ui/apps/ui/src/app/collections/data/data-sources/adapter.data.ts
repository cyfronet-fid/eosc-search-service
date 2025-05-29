import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { IDataSource } from './data-source.model';
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

export const dataSourcesAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (dataSource: Partial<IDataSource> & { id: string }): IResult => ({
    isResearchProduct: false,
    id: dataSource.id,
    // basic information
    title: dataSource.title?.join(' ') || '',
    description: dataSource.description?.join(' ') || '',
    languages: transformLanguages(dataSource?.language),
    horizontal: dataSource?.horizontal,
    type: {
      label: dataSource.type || '',
      value: (dataSource.type || '')?.replace(/ +/gm, '-'),
    },
    url: `${
      ConfigService.config?.marketplace_url
    }/services/${encodeURIComponent(dataSource.pid || '')}`,
    logoUrl: `${
      ConfigService.config?.marketplace_url
    }/services/${encodeURIComponent(dataSource.pid || '')}/logo`,
    orderUrl: `${
      ConfigService.config?.marketplace_url
    }/services/${encodeURIComponent(dataSource.pid || '')}/offers`,
    collection: COLLECTION,
    coloredTags: [],
    tags: [
      {
        label: 'EOSC Node',
        values: toValueWithLabel(toArray(dataSource?.node)),
        filter: 'node',
        showMoreThreshold: 4,
      },
      {
        label: 'Organisation',
        values: toValueWithLabel(toArray(dataSource.resource_organisation)),
        filter: 'resource_organisation',
      },
      {
        label: 'Scientific domain',
        values: toValueWithLabel(toArray(dataSource.scientific_domains)),
        filter: 'scientific_domains',
      },
      {
        label: 'Interoperability guideline',
        values: toValueWithLabel(toArray(dataSource.guidelines)),
        filter: 'guidelines_str',
      },
    ],
    secondaryTags: [
      toInterPatternsSecondaryTag(dataSource.eosc_if ?? [], 'eosc_if'),
      toKeywordsSecondaryTag(dataSource.keywords ?? [], 'keywords'),
    ],
    ...parseStatistics(dataSource),
  }),
};
