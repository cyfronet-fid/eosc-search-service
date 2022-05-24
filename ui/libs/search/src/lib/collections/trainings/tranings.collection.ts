import { IResult } from '../../result.model';
import { CollectionSearchMetadata } from '../collection.model';
import { ITraining } from './training.model';
import {SolrQueryParams} from "../../services/search";

export const trainingsCollection = new CollectionSearchMetadata(
  new SolrQueryParams({
    qf: [],
    collection: 'to be set',
  }),
  {},
  (
    training: Partial<ITraining>,
  ): IResult => ({
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
        originalField: 'author'
      }
    ],
  }),
  {},
  {},
  'Training'
);
