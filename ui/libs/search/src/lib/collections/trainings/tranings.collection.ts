import { ITraining } from './training.model';
import { ICollectionSearchMetadata } from '../../state/results/results.service';
import { IResult } from '../../state/results/results.model';
import { IHasId } from '@eosc-search-service/types';
import { v4 as uuidv4 } from 'uuid';

export const trainingAdapter = (
  training: Partial<ITraining> & IHasId
): IResult => ({
  id: uuidv4(),
  title: training.title || '',
  description: training.description || '',
  type: 'Trainings',
  typeUrlPath: 'trainings',
  collection: 'to be set',
  url: '',
  tags: [
    {
      label: 'Author',
      value: training.author || '',
      originalField: 'author',
    },
  ],
});

export const trainingsCollection: ICollectionSearchMetadata = {
  type: 'Training',
  facets: {},
  filterToField: {},
  fieldToFilter: {},
  _hash: '',
  queryMutator: (q: string) => q,
  inputAdapter: trainingAdapter,
  params: {
    qf: [],
    collection: 'to be set',
  },
};
