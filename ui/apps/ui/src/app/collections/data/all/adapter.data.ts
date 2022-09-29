import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { COLLECTION } from './search-metadata.data';
import { IOpenAIREResult } from '@collections/data/openair.model';
import { last } from 'lodash-es';
import moment from 'moment';
import { IService } from '@collections/data/services/service.model';
import { ITraining } from '@collections/data/trainings/training.model';

const urlAdapter = (
  type: string,
  data: Partial<IOpenAIREResult & IService & ITraining>
) => {
  switch (type) {
    case 'dataset':
    case 'publication':
    case 'software':
      return `https://explore.eosc-portal.eu/search/result?id=${data?.id
        ?.split('|')
        ?.pop()}`;
    case 'service':
      return `https://marketplace.eosc-portal.eu/services/${data?.pid}`;
    case 'training':
      return '/trainings/' + data.id;
    default:
      return '';
  }
};

export const allCollectionsAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (
    data: Partial<IOpenAIREResult & ITraining & IService> & {
      id: string;
    }
  ): IResult => ({
    id: data.id,
    title: data?.title?.join(' ') || '',
    description: data?.description?.join(' ') || '',
    date: data['publication_date']
      ? moment(data['publication_date']).format('DD MMMM YYYY')
      : '',
    url: urlAdapter(data.type || '', data),
    coloredTag: [
      {
        value: data?.best_access_right || '',
        filter: 'best_access_right',
        colorClassName: (data?.best_access_right || '').match(
          /open(.access)?/gi
        )
          ? 'tag-light-green'
          : 'tag-light-coral',
      },
      {
        colorClassName: 'tag-peach',
        filter: 'language',
        value: data?.language || [],
      },
    ],
    tags: [
      {
        label: 'Author names',
        value: data?.author_names || [],
        filter: 'author_names',
      },
      {
        label: 'DOI',
        value: data?.url || [],
        filter: 'url',
      },
    ],
    type: data?.type || '',
    collection: COLLECTION,
  }),
};
