import { IAdapter } from '../../repositories/types';
import { LABEL, URL_PARAM_NAME } from './nav-config.data';
import { v4 as uuidv4 } from 'uuid';
import { COLLECTION } from './search-metadata.data';

export const trainingsAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: <ITraining>(training) => ({
    id: uuidv4(),
    title: training['Resource_title_s'] || '',
    description: training['Description_s'] || '',
    type: LABEL,
    typeUrlPath: URL_PARAM_NAME,
    collection: COLLECTION,
    url: training.URL_s || '',
    tags: [
      {
        label: 'Authors',
        value: training['Author_ss'] || [],
        originalField: 'Author',
      },
      {
        label: 'Key words',
        value: training['Keywords_ss'] || [],
        originalField: 'Keywords',
      },
      {
        label: 'License',
        value: training['License_s'] || '',
        originalField: 'License',
      },
      {
        label: 'Access right',
        value: training['Access_Rights_s'] || '',
        originalField: 'Access_Rights',
      },
      {
        label: 'Created on',
        value: training['Version_date__created_in__s'] || '',
        originalField: 'Version_date__created_in_',
      },
    ],
  }),
};
