import { ITraining } from './training.model';
import { ICollectionSearchMetadata } from '../../state/results/results.service';
import { IResult } from '../../state/results/results.model';
import { IHasId } from '@eosc-search-service/types';
import { v4 as uuidv4 } from 'uuid';

export const trainingAdapter = (
  training: Partial<ITraining> & IHasId
): IResult => ({
  id: uuidv4(),
  title: training["Resource title"] || '',
  description: '',
  type: 'Training',
  typeUrlPath: 'trainings',
  collection: 'trainings',
  url: training.URL || '',
  tags: [
    {
      label: 'Resource type',
      value: training["Resource Type"] || '',
      originalField: 'Resource Type',
    },
  ],
});

export const trainingsCollection: ICollectionSearchMetadata<ITraining> = {
  type: 'Training',
  facets: {
    "Resource title": { field: 'Resource title', type: 'terms' },
    "Resource Type": { field: 'Resource Type', type: 'terms' },
    "Content Type": { field: 'Content Type', type: 'terms' },
    "Pilot Catalogue": { field: 'Pilot Catalogue', type: 'terms' },
  },
  filterToField: {
    'Resource Type': 'Resource type',
    'Content Type': 'Content type',
    'Pilot Catalogue': 'Pilot catalogue'
  },
  fieldToFilter: {
    'Resource type': 'Resource Type',
    'Content type': 'Content Type',
    'Pilot catalogue': 'Pilot Catalogue'
  },
  _hash: '',
  queryMutator: (q: string) => q,
  inputAdapter: trainingAdapter,
  params: {
    qf: ["Resource title"],
    collection: 'trainings',
  },
};
