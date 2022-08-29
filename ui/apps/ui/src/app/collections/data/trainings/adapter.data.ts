import { IAdapter, IResult } from '../../repositories/types';
import { LABEL, URL_PARAM_NAME } from './nav-config.data';
import { v4 as uuidv4 } from 'uuid';
import { COLLECTION } from './search-metadata.data';
import { ITraining } from '@collections/data/trainings/training.model';

export const trainingsAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (training: Partial<ITraining> & { id: string }): IResult => ({
    id: uuidv4(),
    title: training['Resource_title_s'] || '',
    description: training['Description_s'] || '',
    type: LABEL,
    typeUrlPath: URL_PARAM_NAME,
    collection: COLLECTION,
    url: '/trainings/' + training.id || '',
    tags: [
      {
        label: 'Authors',
        value: training['Author_ss'] || [],
        filter: 'Author',
      },
      {
        label: 'Key words',
        value: training['Keywords_ss'] || [],
        filter: 'Keywords',
      },
      {
        label: 'License',
        value: training['License_s'] || '',
        filter: 'License',
      },
      {
        label: 'Access right',
        value: training['Access_Rights_s'] || '',
        filter: 'Access_Rights',
      },
      {
        label: 'Created on',
        value: training['Version_date__created_in__s'] || '',
        filter: 'Version_date__created_in__s',
      },
    ],
  }),
};
