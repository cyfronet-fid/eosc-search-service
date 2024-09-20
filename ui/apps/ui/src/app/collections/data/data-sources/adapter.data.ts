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
    redirectUrl: dataSource.pid
      ? `${ConfigService.config?.eu_marketplace_url}/services/${dataSource.pid}`
      : '',
    logoUrl: dataSource.pid
      ? `${ConfigService.config?.eu_marketplace_url}/services/${dataSource.pid}/logo`
      : '',
    orderUrl: dataSource.pid
      ? `${ConfigService.config?.eu_marketplace_url}/services/${dataSource.pid}/offers`
      : '',
    collection: COLLECTION,
    coloredTags: [],
    tags: [
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
      toKeywordsSecondaryTag(dataSource.tag_list ?? [], 'tag_list'),
    ],
    ...parseStatistics(dataSource),
  }),
};
