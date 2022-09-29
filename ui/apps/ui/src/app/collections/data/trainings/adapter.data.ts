import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { v4 as uuidv4 } from 'uuid';
import { COLLECTION } from './search-metadata.data';
import { ITraining } from '@collections/data/trainings/training.model';
import { last } from 'lodash-es';
import moment from 'moment';

export const trainingsAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (training: Partial<ITraining> & { id: string }): IResult => ({
    id: uuidv4(),
    title: training['title']?.join(' ') || '',
    description: training['description']?.join(' ') || '',
    date: training['publication_date']
      ? moment(training['publication_date']).format('DD MMMM YYYY')
      : '',
    type: training['type'] || '',
    collection: COLLECTION,
    url: '/trainings/' + training.id || '',
    coloredTag: [
      {
        colorClassName: 'tag-almond',
        value: training['license'] || [],
        filter: 'license',
      },
      {
        value: training?.best_access_right || [],
        filter: 'best_access_right',
        colorClassName: (training?.best_access_right || '').match(
          /open(.access)?/gi
        )
          ? 'tag-light-green'
          : 'tag-light-coral',
      },
      {
        colorClassName: 'tag-peach',
        filter: 'language',
        value: training?.language || [],
      },
    ],
    tags: [
      {
        label: 'Authors',
        value: training['author_names'] || [],
        filter: 'author_names',
      },
      {
        label: 'Key words',
        value: training['keywords'] || [],
        filter: 'keywords',
      },
      {
        label: 'Resource type',
        value: training['resource_type'] || [],
        filter: 'resource_type',
      },
      {
        label: 'Content type',
        value: training['content_type'] || [],
        filter: 'content_type',
      },
    ],
  }),
};
