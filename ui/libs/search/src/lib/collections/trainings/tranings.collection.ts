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
  description: training["Description"] || '',
  type: 'Training',
  typeUrlPath: 'trainings',
  collection: 'trainings',
  url: training.URL || '',
      tags: [
    {
      label: 'Authors',
      value: training['Author'] || '',
      originalField: 'Author',
    },
    {
      label: 'Key words',
      value: training['Keywords'] || '',
      originalField: 'Keywords',
    },
    {
      label: 'License',
      value: training['License'] || '',
      originalField: 'License',
    },
    {
      label: 'Access right',
      value: training['Access Rights'] || '',
      originalField: 'Access Rights',
    },
    {
      label: 'Created on',
      value: training['Version date (created in)'] || '',
      originalField: 'Version date (created in)',
    },
  ],
});

export const trainingsCollection: ICollectionSearchMetadata<ITraining> = {
  type: 'Training',
  facets: {
    'Resource title': { field: 'Resource title', type: 'terms' },
    'Resource Type': { field: 'Resource Type', type: 'terms' },
    'Content Type': { field: 'Content Type', type: 'terms' },
    'Language': { field: 'Language', type: 'terms' },
    'License': { field: 'License', type: 'terms' },
    'EOSC PROVIDER': { field: 'EOSC PROVIDER', type: 'terms' },
    'Format': { field: 'Format', type: 'terms' },
    'Level of expertise': { field: 'Level of expertise', type: 'terms' },
    'Target group': { field: 'Target group', type: 'terms' },
    'Qualification': { field: 'Qualification', type: 'terms' },
    'Duration': { field: 'Duration', type: 'terms' },
    'Version date (created in)': { field: 'Version date (created in)', type: 'terms' },
  },
  filterToField: {
    'Resource Type': 'Resource type',
    'Content Type': 'Content type',
    'Language': 'Language',
    'License': 'License',
    'EOSC PROVIDER': 'Organization',
    'Format': 'Format',
    'Level of expertise': 'Level of expertise',
    'Target group': 'Target group',
    'Qualification': 'Qualification',
    'Duration': 'Duration',
    'Version date (created in)': 'Created on',
  },
  fieldToFilter: {
    'Resource type': 'Resource Type',
    'Content type': 'Content Type',
    'Language': 'Language',
    'License': 'License',
    'Organization': 'EOSC PROVIDER',
    'Format': 'Format',
    'Level of expertise': 'Level of expertise',
    'Target group': 'Target group',
    'Qualification': 'Qualification',
    'Duration': 'Duration',
    'Created on': 'Version date (created in)',
  },
  _hash: '',
  queryMutator: (q: string) => q,
  inputAdapter: trainingAdapter,
  params: {
    qf: ["Resource title"],
    collection: 'trainings',
  },
};
