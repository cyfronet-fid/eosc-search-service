import { ISet } from './set.model';
import { ALL_CATALOGS_LABEL } from './all.set';
import {trainingsCollection} from '../collections/trainings/tranings.collection';

export const trainingsSet: ISet = {
  title: 'Trainings',
  breadcrumbs: [
    {
      label: ALL_CATALOGS_LABEL,
      url: '/search/all',
    },
    {
      label: 'Trainings',
      url: '/search/trainings'
    },
  ],
  urlPath: 'trainings',
  collection: trainingsCollection
};
