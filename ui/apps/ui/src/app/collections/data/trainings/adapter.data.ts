import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { v4 as uuidv4 } from 'uuid';
import { COLLECTION } from './search-metadata.data';
import { ITraining } from '@collections/data/trainings/training.model';
import moment from 'moment';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import {
  toAccessRightColoredTag,
  toLanguageColoredTag,
} from '@collections/data/shared-tags';
import {
  parseStatistics,
  toKeywordsSecondaryTag,
} from '@collections/data/utils';

export const trainingsAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (training: Partial<ITraining> & { id: string }): IResult => ({
    sortByOptionOff: false,
    id: uuidv4(),
    title: training['title']?.join(' ') || '',
    description: training['description']?.join(' ') || '',
    date: training['publication_date']
      ? moment(training['publication_date']).format('DD MMMM YYYY')
      : '',
    type: {
      label: training['type'] || '',
      value: training['type'] || '',
    },
    collection: COLLECTION,
    url: '/trainings/' + training.id || '',
    coloredTags: [
      toAccessRightColoredTag(training?.best_access_right),
      {
        colorClassName: 'tag-almond',
        values: toValueWithLabel(toArray(training['license'])),
        filter: 'license',
      },
      toLanguageColoredTag(training?.language),
    ],
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
