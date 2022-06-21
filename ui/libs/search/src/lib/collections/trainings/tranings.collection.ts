import { ITraining } from './training.model';
import { ICollectionSearchMetadata } from '../../state/results/results.service';
import { IResult } from '../../state/results/results.model';
import { IHasId } from '@eosc-search-service/types';
import { v4 as uuidv4 } from 'uuid';

export const trainingAdapter = (
  training: Partial<ITraining> & IHasId
): IResult => ({
  id: uuidv4(),
  title: training["Resource_title"] || '',
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
      value: training['Access_Rights'] || '',
      originalField: 'Access_Rights',
    },
    {
      label: 'Created on',
      value: training['Version_date_(created_in)'] || '',
      originalField: 'Version_date_(created_in)',
    },
  ],
});

export const trainingsCollection: ICollectionSearchMetadata<ITraining> = {
  type: 'Training',
  facets: {
    'Resource_title': { field: 'Resource_title', type: 'terms' },
    'Resource_Type': { field: 'Resource_Type', type: 'terms' },
    'Content_Type': { field: 'Content_Type', type: 'terms' },
    'Language': { field: 'Language', type: 'terms' },
    'License': { field: 'License', type: 'terms' },
    'EOSC_PROVIDER': { field: 'EOSC_PROVIDER', type: 'terms' },
    'Format': { field: 'Format', type: 'terms' },
    'Level_of_expertise': { field: 'Level_of_expertise', type: 'terms' },
    'Target_group': { field: 'Target_group', type: 'terms' },
    'Qualification': { field: 'Qualification', type: 'terms' },
    'Duration': { field: 'Duration', type: 'terms' },
    'Version_date_(created_in)': { field: 'Version_date_(created_in)', type: 'terms' },
  },
  filterToField: {
    'Resource_Type': 'Resource type',
    'Content_Type': 'Content type',
    'Language': 'Language',
    'License': 'License',
    'EOSC_PROVIDER': 'Organization',
    'Format': 'Format',
    'Level_of_expertise': 'Level of expertise',
    'Target_group': 'Target group',
    'Qualification': 'Qualification',
    'Duration': 'Duration',
    'Version_date_(created_in)': 'Created on',
  },
  fieldToFilter: {
    'Resource type': 'Resource_Type',
    'Content type': 'Content_Type',
    'Language': 'Language',
    'License': 'License',
    'Organization': 'EOSC_PROVIDER',
    'Format': 'Format',
    'Level of expertise': 'Level_of_expertise',
    'Target group': 'Target_group',
    'Qualification': 'Qualification',
    'Duration': 'Duration',
    'Created on': 'Version_date_(created_in)',
  },
  _hash: '',
  queryMutator: (q: string) => q,
  inputAdapter: trainingAdapter,
  params: {
    qf: ["Resource_title"],
    collection: 'trainings',
  },
};
