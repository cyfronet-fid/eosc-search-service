import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { v4 as uuidv4 } from 'uuid';
import { COLLECTION } from './search-metadata.data';
import { ITraining } from '@collections/data/trainings/training.model';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import {
  toAccessRightColoredTag,
  transformLanguages,
} from '@collections/data/shared-tags';
import {
  parseStatistics,
  toKeywordsSecondaryTag,
} from '@collections/data/utils';
import { formatPublicationDate } from '@collections/data/utils';

export const trainingsAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (training: Partial<ITraining> & { id: string }): IResult => ({
    isSortByRelevanceCollectionScopeOff: false,
    id: uuidv4(),
    title: training['title']?.join(' ') || '',
    description: training['description']?.join(' ') || '',
    date: formatPublicationDate(training['publication_date']),
    languages: transformLanguages(training?.language),
    license: training?.license,
    type: {
      label: training['type'] || '',
      value: training['type'] || '',
    },
    collection: COLLECTION,
    url: '/trainings/' + training.id || '',
    coloredTags: [toAccessRightColoredTag(training?.best_access_right)],
    tags: [
      {
        label: 'Authors',
        values: toValueWithLabel(toArray(training['author_names'])),
        filter: 'author_names',
      },
      {
        label: 'Resource type',
        values: toValueWithLabel(toArray(training['resource_type'])),
        filter: 'resource_type',
      },
      {
        label: 'Content type',
        values: toValueWithLabel(toArray(training['content_type'])),
        filter: 'content_type',
      },
    ],
    secondaryTags: [
      // toDownloadsStatisticsSecondaryTag(training.usage_counts_downloads),
      // toViewsStatisticsSecondaryTag(training.usage_counts_views),
      toKeywordsSecondaryTag(training.keywords ?? [], 'keywords'),
    ],
    ...parseStatistics(training),
  }),
};
