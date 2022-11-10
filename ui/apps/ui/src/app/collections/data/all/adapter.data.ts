import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { COLLECTION } from './search-metadata.data';
import { IOpenAIREResult } from '@collections/data/openair.model';
import moment from 'moment';
import { IDataSource } from '@collections/data/data-sources/data-source.model';
import { ITraining } from '@collections/data/trainings/training.model';
import { toArray } from '@collections/filters-serializers/utils';
import { IService } from '@collections/data/services/service.model';
import { parseStatistics } from '@collections/data/utils';

const urlAdapter = (
  type: string,
  data: Partial<IOpenAIREResult & IDataSource & IService & ITraining>
) => {
  switch (type) {
    case 'dataset':
    case 'publication':
    case 'software':
      return `https://explore.eosc-portal.eu/search/result?id=${data?.id
        ?.split('|')
        ?.pop()}`;
    case 'data source':
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
    data: Partial<IOpenAIREResult & ITraining & IDataSource & IService> & {
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
    coloredTags: [
      {
        value: toArray(data?.best_access_right),
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
        value: toArray(data?.language),
      },
    ],
    tags: [
      {
        label: 'Author names',
        value: toArray(data?.author_names),
        filter: 'author_names',
      },
      {
        label: 'DOI',
        value: toArray(data?.doi),
        filter: 'doi',
      },
      {
        label: 'Scientific domain',
        value: toArray(data?.scientific_domains),
        filter: 'scientific_domains',
      },
      {
        label: 'Organisation',
        value: toArray(data?.resource_organisation),
        filter: 'resource_organisation',
      },
    ],
    type: {
      label: data.type || '',
      value: (data.type || '')?.replace(/ +/gm, '-'),
    },
    collection: COLLECTION,
    ...parseStatistics(data),
  }),
};
