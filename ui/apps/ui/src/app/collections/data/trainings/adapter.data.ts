import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { COLLECTION } from './search-metadata.data';
import { ITraining } from '@collections/data/trainings/training.model';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import { transformLanguages } from '@collections/data/shared-tags';
import {
  parseStatistics,
  toKeywordsSecondaryTag,
} from '@collections/data/utils';
import { formatPublicationDate } from '@collections/data/utils';

export const trainingsAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (training: Partial<ITraining> & { id: string }): IResult => ({
    isResearchProduct: false,
    id: training.id,
    title: training['title']?.join(' ') || '',
    description: training['description']?.join(' ') || '',
    date: formatPublicationDate(training['publication_date']),
    documentType: toArray(training?.resource_type),
    languages: transformLanguages(training?.language),
    license: training?.license,
    type: {
      label: training['type'] || '',
      value: training['type'] || '',
    },
    collection: COLLECTION,
    redirectUrl: '/trainings/' + training.id || '',
    coloredTags: [],
    tags: [
      {
        label: 'Authors',
        values: toValueWithLabel(toArray(training['author_names'])),
        filter: 'author_names',
        showMoreThreshold: 10,
      },
      {
        label: 'Content type',
        values: toValueWithLabel(toArray(training['content_type'])),
        filter: 'content_type',
      },
      {
        label: 'Scientific domain',
        values: toValueWithLabel(toArray(training?.scientific_domains)),
        filter: 'scientific_domains',
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
