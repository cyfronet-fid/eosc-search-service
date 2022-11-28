import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { COLLECTION } from './search-metadata.data';
import { IOpenAIREResult } from '@collections/data/openair.model';
import moment from 'moment';
import { IDataSource } from '@collections/data/data-sources/data-source.model';
import { ITrainingResponse } from '@pages/trainings-page/repository/training.model';
import { IService } from '@collections/data/services/service.model';
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

type IDataType = Partial<
  IOpenAIREResult & ITrainingResponse & IDataSource & IService
> & {
  id: string;
  type: string;
};

const SERVICES_AS_DATASOURCES = ['b2share', 'b2find', 'b2safe'];

export const hackDataSourceUrl = (pid?: string) => {
  if (!pid) {
    pid = '';
  }

  if (SERVICES_AS_DATASOURCES.includes(pid)) {
    return `https://marketplace.eosc-portal.eu/services/${pid}`;
  }
  return `https://marketplace.eosc-portal.eu/datasources/${pid}`;
};

const urlAdapter = (type: string, data: IDataType) => {
  switch (type) {
    case 'dataset':
    case 'publication':
    case 'software':
    case 'other':
      return `https://explore.eosc-portal.eu/search/result?id=${data?.id
        ?.split('|')
        ?.pop()}`;
    case 'data source':
      return hackDataSourceUrl(data?.pid);
    case 'service':
      return `https://marketplace.eosc-portal.eu/services/${data?.pid}`;
    case 'training':
      return '/trainings/' + data.id;
    default:
      return '';
  }
};

export const customizeResult = (result: IResult, data: IDataType): IResult => {
  switch (data.type) {
    case 'training':
      result.tags.push(
        {
          label: 'Training type',
          values: toValueWithLabel(toArray(data['resource_type'])),
          filter: 'resource_type',
        },
        {
          label: 'Content type',
          values: toValueWithLabel(toArray(data['content_type'])),
          filter: 'content_type',
        }
      );
      break;
  }

  return result;
};

export const allCollectionsAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (data: IDataType): IResult => {
    const result = {
      id: data.id,
      title: data?.title?.join(' ') || '',
      description: data?.description?.join(' ') || '',
      date: data['publication_date']
        ? moment(data['publication_date']).format('DD MMMM YYYY')
        : '',
      url: urlAdapter(data.type || '', data),
      coloredTags: [
        toHorizontalServiceTag(data?.horizontal),
        toAccessRightColoredTag(data?.best_access_right),
        toLanguageColoredTag(data?.language),
      ],
      tags: [
        {
          label: 'Author names',
          values: toValueWithLabel(toArray(data?.author_names)),
          filter: 'author_names',
        },
        {
          label: 'DOI',
          values: toValueWithLabel(toArray(data?.doi)),
          filter: 'doi',
        },
        {
          label: 'Scientific domain',
          values: toValueWithLabel(toArray(data?.scientific_domains)),
          filter: 'scientific_domains',
        },
        {
          label: 'Organisation',
          values: toValueWithLabel(toArray(data?.resource_organisation)),
          filter: 'resource_organisation',
        },
      ],
      type: {
        label: data.type || '',
        value: (data.type || '')?.replace(/ +/gm, '-'),
      },
      collection: COLLECTION,
      secondaryTags: [
        // toDownloadsStatisticsSecondaryTag(data.usage_counts_downloads),
        // toViewsStatisticsSecondaryTag(data.usage_counts_views),
        toKeywordsSecondaryTag(data.keywords ?? [], 'keywords'),
        toKeywordsSecondaryTag(data.tag_list ?? [], 'tag_list'),
      ],
      ...parseStatistics(data),
    };

    customizeResult(result, data);

    return result;
  },
};
