import { ITraining } from './training.model';
import { ICollectionSearchMetadata } from '../../state/results/results.service';
import { IResult } from '../../state/results/results.model';
import { IHasId } from '@eosc-search-service/types';

export const trainingAdapter = (
  training: Partial<ITraining> & IHasId
): IResult => ({
  id: training.id,
  title: training['Resource_title_s'] || '',
  description: training['Description_s'] || '',
  type: 'Training',
  typeUrlPath: 'trainings',
  collection: 'trainings',
  url: '/trainings/' + training.id || '',
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
      value: training['License_s'] || [],
      originalField: 'License',
    },
    {
      label: 'Access right',
      value: training['Access_Rights_s'] || [],
      originalField: 'Access_Rights',
    },
    {
      label: 'Created on',
      value: training['Version_date__created_in__s'] || [],
      originalField: 'Version_date__created_in_',
    },
  ],
});

export const trainingsCollection: ICollectionSearchMetadata<ITraining> = {
  type: 'Training',
  facets: {
    Resource_title_s: { field: 'Resource_title_s', type: 'terms' },
    Resource_Type_s: { field: 'Resource_Type_s', type: 'terms' },
    Content_Type_s: { field: 'Content_Type_s', type: 'terms' },
    Language_s: { field: 'Language_s', type: 'terms' },
    License_S: { field: 'License_s', type: 'terms' },
    EOSC_PROVIDER_s: { field: 'EOSC_PROVIDER_s', type: 'terms' },
    Format_ss: { field: 'Format_s', type: 'terms' },
    Level_of_expertise_s: { field: 'Level_of_expertise_s', type: 'terms' },
    Target_group_s: { field: 'Target_group_s', type: 'terms' },
    Qualification_s: { field: 'Qualification_s', type: 'terms' },
    Duration_s: { field: 'Duration_s', type: 'terms' },
    Version_date__created_in__s: {
      field: 'Version_date__created_in__s',
      type: 'terms',
    },
  },
  filtersConfigurations: [
    {
      filter: 'Resource_Type_s',
      label: 'Resource type',
      type: 'multiselect',
    },
    {
      filter: 'Content_Type_s',
      label: 'Content type',
      type: 'multiselect',
    },
    {
      filter: 'Language_s',
      label: 'Language',
      type: 'multiselect',
    },
    {
      filter: 'EOSC_PROVIDER_s',
      label: 'Organisation',
      type: 'multiselect',
    },
    {
      filter: 'Format_ss',
      label: 'Format',
      type: 'multiselect',
    },
    {
      filter: 'Level_of_expertise_s',
      label: 'Level of expertise',
      type: 'multiselect',
    },
    {
      filter: 'Target_group_s',
      label: 'Target group',
      type: 'multiselect',
    },
    {
      filter: 'Qualification_s',
      label: 'Qualification',
      type: 'multiselect',
    },
    {
      filter: 'Duration_s',
      label: 'Duration',
      type: 'multiselect',
    },
    {
      filter: 'Version_date__created_in__s',
      label: 'Created on',
      type: 'multiselect',
    },
  ],
  _hash: '',
  queryMutator: (q: string) => q,
  inputAdapter: trainingAdapter,
  params: {
    qf: ['Resource_title_s'],
    collection: 'trainings',
  },
};
