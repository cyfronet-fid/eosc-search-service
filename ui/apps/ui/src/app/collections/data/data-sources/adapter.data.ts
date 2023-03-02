import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { IDataSource } from './data-source.model';
import { COLLECTION } from './search-metadata.data';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import {
  toAccessRightColoredTag,
  toHorizontalServiceTag,
  toLanguageColoredTag,
} from '@collections/data/shared-tags';
import {
  parseStatistics,
  toKeywordsSecondaryTag,
} from '@collections/data/utils';
import { ConfigService } from '../../../services/config.service';

const SERVICES_AS_DATASOURCES = ['b2share', 'b2find', 'b2safe'];

export const hackDataSourceUrl = (pid?: string) => {
  if (!pid) {
    pid = '';
  }

  if (SERVICES_AS_DATASOURCES.includes(pid)) {
    return `${ConfigService.config?.marketplace_url}/services/${pid}`;
  }
  return `${ConfigService.config?.marketplace_url}/datasources/${pid}`;
};

export const dataSourcesAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (dataSource: Partial<IDataSource> & { id: string }): IResult => ({
    id: dataSource.id,
    // basic information
    title: dataSource.title?.join(' ') || '',
    description: dataSource.description?.join(' ') || '',
    type: {
      label: dataSource.type || '',
      value: (dataSource.type || '')?.replace(/ +/gm, '-'),
    },
    url: hackDataSourceUrl(dataSource.pid),
    collection: COLLECTION,
    coloredTags: [
      toHorizontalServiceTag(dataSource?.horizontal),
      toAccessRightColoredTag(dataSource?.best_access_right),
      toLanguageColoredTag(dataSource?.language),
    ],
    tags: [
      {
        label: 'Scientific domain',
        values: toValueWithLabel(toArray(dataSource.scientific_domains)),
        filter: 'scientific_domains',
      },
      {
        label: 'Organisation',
        values: toValueWithLabel(toArray(dataSource.resource_organisation)),
        filter: 'resource_organisation',
      },
    ],
    secondaryTags: [
      // toDownloadsStatisticsSecondaryTag(dataSource.usage_counts_downloads),
      // toViewsStatisticsSecondaryTag(dataSource.usage_counts_views),
      toKeywordsSecondaryTag(dataSource.tag_list ?? [], 'tag_list'),
    ],
    ...parseStatistics(dataSource),
  }),
};
