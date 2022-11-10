import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { v4 as uuidv4 } from 'uuid';
import { COLLECTION } from './search-metadata.data';
import { ITraining } from '@collections/data/trainings/training.model';
import moment from 'moment';
import { toArray } from '@collections/filters-serializers/utils';
import { parseStatistics } from '@collections/data/utils';

export const trainingsAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (training: Partial<ITraining> & { id: string }): IResult => ({
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
      {
        value: toArray(training?.best_access_right),
        filter: 'best_access_right',
        colorClassName: (training?.best_access_right || '').match(
          /open(.access)?/gi
        )
          ? 'tag-light-green'
          : 'tag-light-coral',
      },
      {
        colorClassName: 'tag-almond',
        value: toArray(training['license']),
        filter: 'license',
      },
      {
        colorClassName: 'tag-peach',
        filter: 'language',
        value: toArray(training?.language),
      },
    ],
    tags: [
      {
        label: 'Authors',
        value: toArray(training['author_names']),
        filter: 'author_names',
      },
      {
        label: 'Key words',
        value: toArray(training['keywords']),
        filter: 'keywords',
      },
      {
        label: 'Resource type',
        value: toArray(training['resource_type']),
        filter: 'resource_type',
      },
      {
        label: 'Content type',
        value: toArray(training['content_type']),
        filter: 'content_type',
      },
    ],
    ...parseStatistics(training),
  }),
};
